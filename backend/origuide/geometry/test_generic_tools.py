import math
import unittest

from geometry.generic_models import Vector3
from geometry.generic_tools import signed_vector_angle, vector_angle, vector_from_to, normalize, distance, \
    plane_normal, triangle_height


class TestVectorFormTo(unittest.TestCase):
    def test_creates_vectors(self):
        v = vector_from_to(Vector3(1.0, 1.0, 1.0),
                           Vector3(2.0, 2.0, 3.0))
        self.assertEqual(v, Vector3(1.0, 1.0, 2.0))


class TestNormalized(unittest.TestCase):
    def test_normalization(self):
        v = Vector3(12, 89, 11)
        self.assertNotEqual(v.length, 1.0)
        v = normalize(v)
        self.assertAlmostEqual(v.length, 1.0)

    def test_returns_same_vector_for_already_normalized(self):
        v = Vector3(0, 0, 1)
        v_normalized = normalize(v)
        self.assertEqual(v, v_normalized)

    def test_returns_same_vector_for_zero_vector(self):
        v = Vector3(0, 0, 0)
        v_normalized = normalize(v)
        self.assertEqual(v, v_normalized)


class TestDistance(unittest.TestCase):
    def test_returns_distance_between_vectors(self):
        dist = distance(Vector3(1.0, 1.0, 0.0),
                        Vector3(1.0, 1.0, 2.0))
        self.assertAlmostEqual(dist, 2.0)


class TestPlaneNormal(unittest.TestCase):
    def test_returns_normalized_normal(self):
        v1 = Vector3(0.0, 0.0, 0.0)
        v2 = Vector3(1.0, 0.0, 0.0)
        v3 = Vector3(0.0, 1.0, 0.0)

        normal = plane_normal(v1, v2, v3)
        self.assertAlmostEqual(normal.length, 1.0)
        self.assertEqual(normal, Vector3(0.0, 0.0, 1.0))

    def test_takes_orientation_into_account(self):
        v1 = Vector3(0.0, 0.0, 0.0)
        v2 = Vector3(1.0, 0.0, 0.0)
        v3 = Vector3(0.0, 1.0, 0.0)
        normal_1 = plane_normal(v1, v2, v3)
        normal_2 = plane_normal(v3, v2, v1)
        self.assertEqual(normal_1, -normal_2)


class TestTriangleHeight(unittest.TestCase):
    def test_returns_triangle_height(self):
        height = triangle_height(Vector3(1.0, 0.0, 0.0),
                                 Vector3(0.0, 5.0, 0.0))
        self.assertAlmostEqual(height, 5.0)

    def test_returns_zero_when_triangle_is_malformed(self):
        height = triangle_height(Vector3(1.0, 0.0, 0.0),
                                 Vector3(3.0, 0.0, 0.0))
        self.assertAlmostEqual(height, 0.0)


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
