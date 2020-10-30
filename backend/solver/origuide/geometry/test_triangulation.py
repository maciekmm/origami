import unittest
from itertools import permutations

import numpy as np

from origuide.geometry.geometry_models import Vertex
from origuide.geometry.triangulation import triangulate


class TriangulationTestCase(unittest.TestCase):
    def assertTriangulatesSquare(self, triangulated, diagonal1, diagonal2):
        self.assertEqual(len(triangulated), 2)
        for t in triangulated:
            self.assertEqual(len(t), 3)

        triangulated_pos_set1 = set(map(lambda v: v.pos, triangulated[0]))
        triangulated_pos_set2 = set(map(lambda v: v.pos, triangulated[1]))

        # Make sure 2 triangles have 2 points in common, and one not
        self.assertEqual(len(triangulated_pos_set1 - triangulated_pos_set2), 1)
        self.assertEqual(len(triangulated_pos_set2 - triangulated_pos_set1), 1)

        # Make sure 2 points not common lie on the diagonal
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

    def isTrianglesEqual(self, verts1, verts2):
        """
        Checks all 3 "turns" of a triangle
        """
        verts1 = verts1.copy()
        verts2 = verts2.copy()
        for verts_turn in permutations(verts1):
            if all([v[0] == v[1] for v in zip(verts_turn, verts2)]):
                return True
        return False


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

    def test_handles_convex_polygons(self):
        """
        The original Delaunay algorithm always outputs a convex polygon
        so, let us make sure that the boundary stays the same if it is concave
        """
        v1 = Vertex(0, 0, 10, 0)
        v2 = Vertex(1, 10, 0, 0)
        v3 = Vertex(2, 4, 0, 0)
        v4 = Vertex(3, 4, 4, 0)

        face = [v1, v2, v3, v4]
        triangles = triangulate(face)
        self.assertEqual(len(triangles), 2)

        # There is only one way to triangulate this polygon, so that it preserves the boundary
        tri1 = [v1, v2, v4]
        tri2 = [v2, v3, v4]

        tri1_present = False
        if self.isTrianglesEqual(tri1, triangles[0]):
            tri1_present = True
        elif self.isTrianglesEqual(tri1, triangles[1]):
            tri1_present = True

        tri2_present = False
        if self.isTrianglesEqual(tri2, triangles[0]):
            tri2_present = True
        elif self.isTrianglesEqual(tri2, triangles[1]):
            tri2_present = True

        self.assertTrue(tri1_present)
        self.assertTrue(tri2_present)

    def test_handles_numerical_stability_in_disjoint_check(self):
        """
        Looks strange, this test case is a real-life scenario that happened.
        Disjointness check is "too-precise", sometimes even for convex polygons, it
        would return too little triangles from the triangulation
        """
        v1 = Vertex(0, 3, 0, 0)
        v2 = Vertex(1, 4, 0, 0)
        v3 = Vertex(2, 4.571428571428572, 1.428571428571428, 0)
        v4 = Vertex(3, 3.047619047619047, 0.9523809523809523, 0)

        face = [v1, v2, v3, v4]
        triangles = triangulate(face)
        self.assertEqual(len(triangles), 2)
