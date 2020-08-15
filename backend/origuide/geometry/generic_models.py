import math
from typing import List


class Vector3:
    def __init__(self, x: float, y: float, z: float): self.vec = [x, y, z]

    @classmethod
    def from_vec(cls, vec: List[float]):
        return cls(vec[0], vec[1], vec[2])

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

    @property
    def length(self):
        return math.sqrt(self.vec[0]**2 + self.vec[1]**2 + self.vec[2]**2)

    def __getitem__(self, index):
        if 0 <= index < len(self.vec):
            return self.vec[index]
        raise IndexError('Vector index out of range')

    def __setitem__(self, index, value):
        if 0 <= index < len(self.vec):
            self.vec[index] = value

    def __eq__(self, other):
        return self.vec[0] == other.vec[0] and \
            self.vec[1] == other.vec[1] and \
            self.vec[2] == other.vec[2]

    def __hash__(self):
        return hash(tuple(self.vec))

    def __add__(self, other):
        return Vector3(self.vec[0] + other.vec[0],
                       self.vec[1] + other.vec[1],
                       self.vec[2] + other.vec[2])

    def __sub__(self, other):
        return Vector3(self.vec[0] - other.vec[0],
                       self.vec[1] - other.vec[1],
                       self.vec[2] - other.vec[2])

    def __neg__(self):
        return Vector3(-self.vec[0],
                       -self.vec[1],
                       -self.vec[2])

    def __mul__(self, other):
        other_type = type(other)
        if other_type != float and other_type != int:
            raise TypeError('unsupported operand type(s) for *')
        return Vector3(self.vec[0] * other,
                       self.vec[1] * other,
                       self.vec[2] * other)

    def __rmul__(self, other):
        other_type = type(other)
        if other_type != float and other_type != int:
            raise TypeError('unsupported operand type(s) for *')
        return Vector3(self.vec[0] * other,
                       self.vec[1] * other,
                       self.vec[2] * other)

    def __truediv__(self, other):
        other_type = type(other)
        if other_type != float and other_type != int:
            raise TypeError('unsupported operand type(s) for /')
        return Vector3(self.vec[0] / other,
                       self.vec[1] / other,
                       self.vec[2] / other)

    def __str__(self):
        return 'Vector3' \
               ' (x, y, z): {}, {}, {}'.format(self.x, self.y, self.z)

