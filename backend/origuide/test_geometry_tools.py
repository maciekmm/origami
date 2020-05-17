import math
import unittest

from generic_models import Vector3
from geometry_tools import signed_vector_angle, vector_angle


class TestSignedVectorAngle(unittest.TestCase):
    def test_positive_angle(self):
        v1 = Vector3(0, 3, 0)
        v2 = Vector3(0, 0, 3)
        n = Vector3(1, 0, 0)

        angle = signed_vector_angle(v1, v2, n)
        self.assertEqual(angle, math.pi / 2)

    def test_rotated_positive_to_negative(self):
        v1 = Vector3(0, 3, 0)
        v2 = Vector3(0, 0, 3)
        n = Vector3(-1, 0, 0)

        angle = signed_vector_angle(v1, v2, n)
        self.assertEqual(angle, -math.pi / 2)

    def test_negative_angle(self):
        v1 = Vector3(0, -3, 0)
        v2 = Vector3(0, 0, 3)
        n = Vector3(1, 0, 0)

        angle = signed_vector_angle(v1, v2, n)
        self.assertEqual(angle, -math.pi / 2)

    def test_zero_angle(self):
        v1 = Vector3(0, 0, 3)
        v2 = Vector3(0, 0, 12)
        n = Vector3(0, 1, 0)

        angle = signed_vector_angle(v1, v2, n)
        self.assertEqual(angle, 0)

    def test_180_angle(self):
        v1 = Vector3(1, 1, 3)
        v2 = Vector3(-1, -1, -3)
        n = Vector3(1, 0, 0)

        angle = signed_vector_angle(v1, v2, n)
        self.assertEqual(angle, math.pi)

    def test_rotated_positive_to_negative_180_angle(self):
        v1 = Vector3(1, 1, 3)
        v2 = Vector3(-1, -1, -3)
        n = Vector3(-1, 0, 0)

        angle = signed_vector_angle(v1, v2, n)
        self.assertEqual(angle, math.pi)


class TestVectorAngle(unittest.TestCase):
    def test_positive_angle(self):
        v1 = Vector3(0, 0, 3)
        v2 = Vector3(1, 3, 0)

        angle = vector_angle(v2, v1)
        self.assertEqual(angle, math.pi / 2)

    def test_opposite_positive_angle(self):
        v1 = Vector3(0, 0, 3)
        v2 = Vector3(1, -3, 0)

        angle = vector_angle(v2, v1)
        self.assertEqual(angle, math.pi / 2)

    def test_zero_angle(self):
        v1 = Vector3(0, 0, 3)
        v2 = Vector3(0, 0, 12)

        angle = vector_angle(v2, v1)
        self.assertEqual(angle, 0)

    def test_180_angle(self):
        v1 = Vector3(1, 1, 3)
        v2 = Vector3(-1, -1, -3)

        angle = vector_angle(v2, v1)
        self.assertEqual(angle, math.pi)
