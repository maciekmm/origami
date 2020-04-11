from enum import unique, Enum, auto

import numpy as np


@unique
class ForceName(Enum):
    BEAM = auto()
    CREASE = auto()
    FACE = auto()


class Vector3:
    def __init__(self, x: float, y: float, z: float):
        self.vec = np.array([x, y, z])

    @classmethod
    def from_vec(cls, np_vector: np.array):
        return cls(np_vector[0], np_vector[1], np_vector[2])

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

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y and self.z == other.z

    def __hash__(self):
        """
        Just defined to be able to use eq as a value equal.
        DO NOT use this class instances as keys in dicts
        """
        return hash((self.x, self.y, self.z))
