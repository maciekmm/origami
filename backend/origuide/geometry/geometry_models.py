import logging
from enum import unique, Enum, auto

import numpy as np

from config import CONFIG
from geometry.generic_models import Vector3
from geometry.generic_tools import plane_normal, vector_angle, vector_from_to, distance, signed_vector_angle

# Left as constants, not an enum as the strings carry the meaning in FOLD format
EDGE_BOUNDARY = 'B'
EDGE_VALLEY = 'V'
EDGE_MOUNTAIN = 'M'
EDGE_FLAT = 'F'
EDGE_UNKNOWN = 'U'


@unique
class ForceName(Enum):
    BEAM = auto()
    CREASE = auto()
    FACE = auto()
    DAMPING = auto()


def angle_from_assignment(assignment):
    if assignment == EDGE_VALLEY:
        return np.pi
    elif assignment == EDGE_MOUNTAIN:
        return -np.pi
    return 0


class Vertex:
    def __init__(self, x: float, y: float, z: float):
        self.pos = Vector3(x, y, z)
        self._total_force = Vector3(0.0, 0.0, 0.0)
        self.velocity = Vector3(0.0, 0.0, 0.0)

    @property
    def x(self):
        return self.pos[0]

    @x.setter
    def x(self, val):
        self.pos[0] = val

    @property
    def y(self):
        return self.pos[1]

    @y.setter
    def y(self, val):
        self.pos[1] = val

    @property
    def z(self):
        return self.pos[2]

    @z.setter
    def z(self, val):
        self.pos[2] = val

    def __str__(self):
        return 'Vertex (x, y, z): {}, {}, {}'.format(self.x, self.y, self.z)

    def set_force(self, name: ForceName, force: Vector3):
        if CONFIG['DEBUG_ENABLED']:
            logging.debug('Setting force {}:{} on {}'.format(
                name,
                force,
                self.__str__()
            ))

        self._total_force += force

    def total_force(self):
        return self._total_force

    def reset_forces(self):
        self._total_force = Vector3(0.0, 0.0, 0.0)

    @property
    def mass(self):
        return 1.0


class Edge:
    def __init__(self, v1: Vertex, v2: Vertex, assignment: str):
        self.v1 = v1
        self.v2 = v2
        self.orientation_vec = vector_from_to(v1.pos, v2.pos)
        self.assignment = assignment
        self.l0 = self.length

        self.face_left = None   # face on the left as defined by edge orientation
        self.face_right = None   # face on the right as defined by edge orientation

        # TODO: Hmm. Although edge properties, these 2 have knowledge that NO SIMPLE EDGE SHOULD EVER POSSES. WHAAAAAAA!!!1!1!!1

        if self.l0 == 0:    # in general, this should not be the case
            self.k_axial = CONFIG['AXIAL_STIFFNESS_EA']
        else:
            self.k_axial = CONFIG['AXIAL_STIFFNESS_EA'] / self.l0

        self.damping_coeff = CONFIG['DAMPING_PERCENT'] * 2 * np.sqrt(self.k_axial * min(self.v1.mass, self.v2.mass))

    @property
    def length(self):
        return distance(self.v1.pos, self.v2.pos)

    def faces_angle(self):
        if self.face_left is None or self.face_right is None:
            raise RuntimeError("Cannot compute angle: exactly 2 faces must be assigned to an self")

        return signed_vector_angle(self.face_right.normal, self.face_left.normal, self.orientation_vec)

    def __str__(self):
        return 'Edge: {} -> {}, assignment: {}, l0: {}'.format(self.v1, self.v2, self.assignment, self.l0)


class Face:
    def __init__(self, v1: Vertex, v2: Vertex, v3: Vertex):
        self.vertices = [v1, v2, v3]
        self.alfa0 = [self.angle_for_vertex(v) for v in self.vertices]

    @property
    def normal(self):
        return plane_normal(self.vertices[0].pos, self.vertices[1].pos, self.vertices[2].pos)

    def angle_for_vertex(self, v: Vertex):
        """
        Returns plane angle at the given vertex v,
        or raises an Error if such vertex is not in the face
        """
        # p1 ---> p2
        # p1 ---> p3
        i = self.vertices.index(v)

        p1 = self.vertices[i]
        p2 = self.vertices[(i + 1) % len(self.vertices)]
        p3 = self.vertices[(i + 2) % len(self.vertices)]

        return vector_angle(vector_from_to(p1.pos, p2.pos), vector_from_to(p1.pos, p3.pos))

    def prev_vertex(self, v: Vertex):
        return self.vertices[(self.vertices.index(v) - 1 + len(self.vertices)) % len(self.vertices)]

    def next_vertex(self, v: Vertex):
        return self.vertices[(self.vertices.index(v) + 1) % len(self.vertices)]

    def __str__(self):
        return 'Face: {} -> {} -> {}'.format(self.vertices[0], self.vertices[1], self.vertices[2])
