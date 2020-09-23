import unittest

from origuide.geometry.generic_models import Vector3


class TestVector3(unittest.TestCase):
    def test_vector3_are_treated_as_equal_with_same_coordinates(self):
        v1 = Vector3(1, 2, 3)
        v2 = Vector3(1, 2, 3)
        self.assertEqual(v1, v2)

    def test_not_equality(self):
        v1 = Vector3(1, 3, 2)
        v2 = Vector3(1, 2, 3)
        self.assertNotEqual(v1, v2)

    def test_hash_equal(self):
        v1 = Vector3(1, 2, 3)
        v2 = Vector3(1, 2, 3)
        self.assertEqual(hash(v1), hash(v2))

    def test_hash_not_equal(self):
        v1 = Vector3(1, 3, 2)
        v2 = Vector3(1, 2, 3)
        self.assertNotEqual(hash(v1), hash(v2))

    def test_getting_by_index(self):
        v = Vector3(1, 2, 3)

        self.assertEqual(v[0], 1)
        self.assertEqual(v[1], 2)
        self.assertEqual(v[2], 3)
        self.assertRaises(IndexError, lambda: v[3])
        self.assertRaises(IndexError, lambda: v[-1])

    def test_setting_by_index(self):
        v = Vector3(1, 2, 3)
        v[0] = 4
        v[1] = 5
        v[2] = 6

        self.assertEqual(v[0], 4)
        self.assertEqual(v[1], 5)
        self.assertEqual(v[2], 6)

    def test_vector_adding(self):
        v1 = Vector3(1, 2, 3)
        v2 = Vector3(4, 5, 6)

        self.assertEqual(v1 + v2, Vector3(5, 7, 9))

    def test_vector_subtraction(self):
        v1 = Vector3(1, 2, 3)
        v2 = Vector3(1, 1, 1)

        self.assertEqual(v1 - v2, Vector3(0, 1, 2))

    def test_negation(self):
        v = Vector3(1, 2, 3)
        self.assertEqual(-v, Vector3(-1, -2, -3))

    def test_multiply_by_number(self):
        v = Vector3(1, 2, 3)
        self.assertEqual(v * 2, Vector3(2, 4, 6))
        self.assertEqual(2 * v, Vector3(2, 4, 6))

    def test_length(self):
        v = Vector3(1, 2, 2)
        self.assertEqual(v.length, 3)
        v = Vector3(-1, 2, 2)
        self.assertEqual(v.length, 3)
        v = Vector3(1, -2, 2)
        self.assertEqual(v.length, 3)
        v = Vector3(1, 2, -2)
        self.assertEqual(v.length, 3)
        v = Vector3(0, 0, 3)
        self.assertEqual(v.length, 3)
        v = Vector3(3, 0, 0)
        self.assertEqual(v.length, 3)
        v = Vector3(0, 3, 0)
        self.assertEqual(v.length, 3)

    def test_division_by_number(self):
        v = Vector3(1, 2, 3)
        self.assertEqual(v / 2, Vector3(0.5, 1, 1.5))
