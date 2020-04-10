import logging
from enum import Enum, unique, auto

import numpy as np

from config import CONFIG


@unique
class ForceName(Enum):
    BEAM = auto()
    CREASE = auto()
    FACE = auto()


class Vector3:
    def __init__(self, x: float, y: float, z: float):
        self.vec = np.array([x, y, z])

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
        return 'Vector3' \
               ' (x, y, z): {}, {}, {}'.format(self.x, self.y, self.z)


class Vertex(Vector3):
    def __init__(self, x: float, y: float, z: float):
        super().__init__(x, y, z)

        self.forces = {}

    def __str__(self):
        return 'Vertex (x, y, z): {}, {}, {}'.format(self.x, self.y, self.z)

    def set_force(self, force: ForceName, val: float):
        if CONFIG['DEBUG_ENABLED']:
            logging.debug('Setting force {}:{} on {}'.format(
                force,
                val,
                self.__str__()
            ))
        self.forces[force] = val

    def total_force(self):
        return sum(self.forces.values())


class Edge:
    def __init__(self, v1: Vertex, v2: Vertex, assignment: str):
        self.v1 = v1
        self.v2 = v2
        self.assignment = assignment
        self.l0 = self.length()

# TODO: Maybe we don't need k_axial. Probably it can be altogether degined by CONFIG'S
# AXIAL_STIFFNESS
#        self.k_axial = self.calculate_k_axial()
#
#    def calculate_k_axial(self):
#        return CONFIG['AXIAL_STIFFNESS_EA'] / self.l0

    def length(self):
        return np.linalg.norm(np.subtract(self.v1.vec, self.v2.vec))

    def __str__(self):
        return 'Edge: {} -> {}, l0: {}'.format(self.v1, self.v2, self.l0)


class Face:
    def __init__(self, v1: Vertex, v2: Vertex, v3: Vertex):
        self.v1 = v1
        self.v2 = v2
        self.v3 = v3

    def __str__(self):
        return 'Face: {} -> {} -> {}'.format(self.v1, self.v2, self.v3)


