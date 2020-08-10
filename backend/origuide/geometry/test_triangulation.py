import unittest

import numpy as np

from geometry.geometry_models import Vertex
from geometry.triangulation import triangulate


class TriangulationTestCase(unittest.TestCase):
    def assertTriangulatesSquare(self, triangulated, diagonal1, diagonal2):
        self.assertEqual(len(triangulated), 2)
        triangulated_pos_set1 = set(map(lambda v: v.pos, triangulated[0]))
        triangulated_pos_set2 = set(map(lambda v: v.pos, triangulated[1]))

        self.assertEqual(len(triangulated_pos_set1 - triangulated_pos_set2), 1)
        self.assertEqual(len(triangulated_pos_set2 - triangulated_pos_set1), 1)

        outside_vertex1 = (triangulated_pos_set1 - triangulated_pos_set2).pop()
        outside_vertex2 = (triangulated_pos_set2 - triangulated_pos_set1).pop()
        outside_vector = (outside_vertex1 - outside_vertex2).vec

        self.assertDiagonalVector(outside_vector, diagonal1, diagonal2)

    def assertDiagonalVector(self, vec_to_check, diagonal1, diagonal2):
        diagonal_vector = False
        if (vec_to_check == diagonal1).all() or \
                (vec_to_check == -diagonal1).all() or \
                (vec_to_check == diagonal2).all() or \
                (vec_to_check == -diagonal2).all():
            diagonal_vector = True

        self.assertTrue(diagonal_vector)


class TestTriangulation(TriangulationTestCase):
    def test_does_not_change_triangular_face(self):
        face = [Vertex(0, 1, 0, 0), Vertex(1, 2, 0, 0), Vertex(2, 0, 2, 0)]

        triangulated = triangulate(face)
        self.assertEqual(len(triangulated), 1)

        triangulated_pos_set = set(map(lambda v: v.pos, triangulated[0]))
        pos_set = set(map(lambda v: v.pos, face))

        self.assertEqual(pos_set, triangulated_pos_set)

    def test_triangulates_square_along_xy_plane(self):
        face = [Vertex(0, 0, 0, 0),
                Vertex(1, 1, 0, 0),
                Vertex(2, 1, 1, 0),
                Vertex(3, 0, 1, 0),
                ]

        diagonal1 = np.array([1, 1, 0])
        diagonal2 = np.array([1, -1, 0])

        triangulated = triangulate(face)
        self.assertTriangulatesSquare(triangulated, diagonal1, diagonal2)

    def test_triangulates_square_along_xz_plane(self):
        face = [Vertex(0, 0, 0, 0),
                Vertex(1, 1, 0, 0),
                Vertex(2, 1, 0, 1),
                Vertex(3, 0, 0, 1),
                ]
        triangulated = triangulate(face)
        diagonal1 = np.array([1, 0, 1])
        diagonal2 = np.array([1, 0, -1])

        self.assertTriangulatesSquare(triangulated, diagonal1, diagonal2)

    def test_triangulates_square_along_yz_plane(self):
        face = [Vertex(0, 0, 0, 0),
                Vertex(1, 0, 1, 0),
                Vertex(2, 0, 1, 1),
                Vertex(3, 0, 0, 1),
                ]
        triangulated = triangulate(face)
        diagonal1 = np.array([0, 1, 1])
        diagonal2 = np.array([0, -1, 1])

        self.assertTriangulatesSquare(triangulated, diagonal1, diagonal2)

