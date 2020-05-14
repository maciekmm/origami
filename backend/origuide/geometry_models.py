import logging

import numpy as np

from config import CONFIG
from generic_models import ForceName, Vector3
from geometry_tools import plane_normal, vector_angle, vector_from_to, distance

EDGE_BOUNDARY = 'B'
EDGE_VALLEY = 'V'
EDGE_MOUNTAIN = 'M'
EDGE_FLAT = 'F'
EDGE_UNKNOWN = 'U'


def angle_from_assignment(assignment):
    if assignment == EDGE_VALLEY:
        return np.pi
    elif assignment == EDGE_MOUNTAIN:
        return -np.pi
    return 0


class Vertex:
    def __init__(self, x: float, y: float, z: float):
        self.vec = Vector3(x, y, z)

        self.reset_forces()
        # self.forces = {}

    @property
    def x(self):
        return self.vec[0]

    @x.setter
    def x(self, val):
        self.vec[0] = val

    @property
    def y(self):
        return self.vec[1]

    @y.setter
    def y(self, val):
        self.vec[1] = val

    @property
    def z(self):
        return self.vec[2]

    @z.setter
    def z(self, val):
        self.vec[2] = val

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
        # self.forces[name] = force

    def total_force(self):
        return self._total_force
        # return np.sum(np.array(list(self.forces.values())), axis=0)

    def reset_forces(self):
        self._total_force = Vector3(0.0, 0.0, 0.0)

    @property
    def mass(self):
        return 1.0


class Edge:
    def __init__(self, v1: Vertex, v2: Vertex, assignment: str):
        self.v1 = v1
        self.v2 = v2
        self.assignment = assignment
        self.l0 = self.length()

        # TODO: Not sure yet if it's a good idea to have faces in here
        self.face_left = None   # face on the left as defined by edge orientation
        self.face_right = None   # face on the right as defined by edge orientation
        self.k_axial = CONFIG['AXIAL_STIFFNESS_EA'] / self.l0

    def length(self):
        return distance(self.v1.vec, self.v2.vec)

    def face_angle(self):
        if self.face_left is None or self.face_right is None:
            raise RuntimeError("Cannot compute angle: exactly 2 faces must be assigned to an edge")

        return vector_angle(self.face_left.normal, self.face_right.normal)

    def __str__(self):
        return 'Edge: {} -> {}, assignment: {}, l0: {}'.format(self.v1, self.v2, self.assignment, self.l0)


class Face:
    def __init__(self, v1: Vertex, v2: Vertex, v3: Vertex):
        self.vertices = [v1, v2, v3]
        self.alfa0 = []
        for v in self.vertices:
            self.alfa0.append(self.angle_for_vertex(v))

    def angle_for_vertex(self, v: Vertex):
        # p1 ---> p2
        # p1 ---> p3
        i = self.vertices.index(v)

        p1 = self.vertices[i]
        p2 = self.vertices[(i + 1) % len(self.vertices)]
        p3 = self.vertices[(i + 2) % len(self.vertices)]

        return vector_angle(vector_from_to(p1.vec, p2.vec), vector_from_to(p1.vec, p3.vec))

    def prev_vertex(self, v: Vertex):
        return self.vertices[(self.vertices.index(v) - 1 + len(self.vertices)) % len(self.vertices)]

    def next_vertex(self, v: Vertex):
        return self.vertices[(self.vertices.index(v) + 1) % len(self.vertices)]

    def __str__(self):
        return 'Face: {} -> {} -> {}'.format(self.vertices[0], self.vertices[1], self.vertices[2])

    @property
    def normal(self):
        return plane_normal(self.vertices[0].vec, self.vertices[1].vec, self.vertices[2].vec)
