from enum import unique, Enum, auto

import numpy as np


@unique
class ForceName(Enum):
    BEAM = auto()
    CREASE = auto()
    FACE = auto()


# TODO: Maybe some vector library that handles this?
# TODO: For sure make this a "value object". Otherwise it can be a cause of hard to trace bugs. This is critical. It breaks things
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

    def __add__(self, other):
        return Vector3.from_vec(self.vec + other.vec)

    def __sub__(self, other):
        return Vector3.from_vec(self.vec - other.vec)

    def __str__(self):
        return 'Vector3' \
               ' (x, y, z): {}, {}, {}'.format(self.x, self.y, self.z)
