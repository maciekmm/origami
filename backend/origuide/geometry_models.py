import logging

import numpy as np

from config import CONFIG
from generic_models import ForceName, Vector3
from geometry_tools import plane_normal, vector_angle, vector_from_to

EDGE_BOUNDARY = 'B'
EDGE_VALLEY = 'V'
EDGE_MOUNTAIN = 'M'
EDGE_FLAT = 'F'
EDGE_UNKNOWN = 'U'


def angle_from_assignment(assignment):
    if assignment == EDGE_VALLEY:
        return np.PI
    elif assignment == EDGE_MOUNTAIN:
        return -np.PI
    return 0


class Vertex(Vector3):
    def __init__(self, x: float, y: float, z: float):
        super().__init__(x, y, z)

        self.forces = []

    def __str__(self):
        return 'Vertex (x, y, z): {}, {}, {}'.format(self.x, self.y, self.z)

    def set_force(self, force: ForceName, val: float):
        if CONFIG['DEBUG_ENABLED']:
            logging.debug('Setting force {}:{} on {}'.format(
                force,
                val,
                self.__str__()
            ))
        self.forces.append(val)

    def total_force(self):
        return np.sum(np.array(self.forces), axis=0)


class Edge:
    def __init__(self, v1: Vertex, v2: Vertex, assignment: str):
        self.v1 = v1
        self.v2 = v2
        self.assignment = assignment
        self.l0 = self.length()

        # TODO: Not sure yet if it's a good idea to have faces in here
        self.face1 = None   # face on the left as defined by edge orientation
        self.face2 = None   # face on the right as defined by edge orientation

    def length(self):
        return np.linalg.norm(np.subtract(self.v1.vec, self.v2.vec))

    def face_angle(self):
        if self.face1 is None or self.face2 is None:
            raise RuntimeError("Cannot compute angle: exactly 2 faces must be assigned to an edge")

        return vector_angle(self.face1.normal, self.face2.normal)

    def __str__(self):
        return 'Edge: {} -> {}, l0: {}'.format(self.v1, self.v2, self.l0)


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

        return vector_angle(vector_from_to(p1, p2), vector_from_to(p1, p3))

    def prev_vertex(self, v: Vertex):
        return self.vertices[(self.vertices.index(v) - 1 + len(self.vertices)) % len(self.vertices)]

    def next_vertex(self, v: Vertex):
        return self.vertices[(self.vertices.index(v) + 1) % len(self.vertices)]

    def __str__(self):
        return 'Face: {} -> {} -> {}'.format(self.vertices[0], self.vertices[1], self.vertices[2])

    @property
    def normal(self):
        return plane_normal(self.vertices[0], self.vertices[1], self.vertices[2])
