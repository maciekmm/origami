import math
import unittest

from geometry.generic_models import Vector3
from geometry.geometry_models import Vertex, Edge, EDGE_VALLEY, Face, ForceName


class TestVertexForces(unittest.TestCase):
    def setUp(self) -> None:
        self.v = Vertex(0, 0, 0)

    def test_forces_manipulation(self):
        self.v.set_force(ForceName.BEAM, Vector3(1, 1, 0))
        self.v.set_force(ForceName.DAMPING, Vector3(1, 1, 0))
        self.v.set_force(ForceName.CREASE, Vector3(1, 1, 0))
        self.v.set_force(ForceName.FACE, Vector3(1, 1, -1))

        self.assertEqual(self.v.total_force(), Vector3(4, 4, -1))

        self.v.reset_forces()
        self.assertEqual(self.v.total_force(), Vector3(0, 0, 0))


class TestEdgeLength(unittest.TestCase):
    def test_returns_edge_length(self):
        edge = Edge(Vertex(0, 0, 0), Vertex(1, 0, 0), EDGE_VALLEY)
        self.assertEqual(edge.length, 1)

    def test_returns_zero_length(self):
        edge = Edge(Vertex(0, 0, 0), Vertex(0, 0, 0), EDGE_VALLEY)
        self.assertEqual(edge.length, 0)


class TestEdgeFacesAngle(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 0, 0)
        self.v2 = Vertex(1, 0, 0)
        self.v3 = Vertex(0, 1, 0)

        self.v4 = Vertex(0, 0, 1)

        self.edge = Edge(self.v1, self.v3, EDGE_VALLEY)
        self.face1 = Face(self.v1, self.v2, self.v3)
        self.face2 = Face(self.v1, self.v3, self.v4)

    def setFaces(self):
        self.edge.face_right = self.face1
        self.edge.face_left = self.face2

    def test_it_throws_if_there_are_not_2_faces_on_edge(self):
        self.assertRaises(RuntimeError, lambda: self.edge.faces_angle())

        self.edge.face_left = self.face2
        self.edge.face_right = None
        self.assertRaises(RuntimeError, lambda: self.edge.faces_angle())

        self.edge.face_right = self.face1
        self.edge.face_left = None
        self.assertRaises(RuntimeError, lambda: self.edge.faces_angle())

    def test_it_returns_an_angle_between_2_faces(self):
        self.setFaces()
        self.assertEqual(self.edge.faces_angle(), math.pi / 2)

    def test_it_takes_edge_orientation_into_account(self):
        self.setFaces()
        self.edge.orientation_vec = -self.edge.orientation_vec
        self.assertEqual(self.edge.faces_angle(), -math.pi / 2)


class TestFaceNormal(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 3, 0)
        self.v2 = Vertex(0, 4, 0)
        self.v3 = Vertex(0, 3, 1)

        self.face1 = Face(self.v1, self.v2, self.v3)
        self.face2 = Face(self.v3, self.v2, self.v1)

    def test_returns_plane_normal(self):
        self.assertEqual(self.face1.normal, Vector3(1, 0, 0))

    def test_takes_orientation_into_account(self):
        self.assertEqual(self.face2.normal, Vector3(-1, 0, 0))


class TestFaceAngles(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 0, 0)
        self.v2 = Vertex(3, 0, 0)
        self.v3 = Vertex(0, 3, 0)

        self.face = Face(self.v1, self.v2, self.v3)

    def test_returns_correct_angles(self):
        self.assertEqual(self.face.angle_for_vertex(self.v1), math.pi / 2)
        self.assertEqual(self.face.angle_for_vertex(self.v2), math.pi / 4)
        self.assertEqual(self.face.angle_for_vertex(self.v3), math.pi / 4)


class TestFaceNextPrevVertex(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 0, 0)
        self.v2 = Vertex(3, 0, 0)
        self.v3 = Vertex(0, 3, 0)

        self.face = Face(self.v1, self.v2, self.v3)

    def test_returns_next_vertex(self):
        self.assertEqual(self.face.next_vertex(self.v1), self.v2)
        self.assertEqual(self.face.next_vertex(self.v2), self.v3)
        self.assertEqual(self.face.next_vertex(self.v3), self.v1)

    def test_returns_previous_vertex(self):
        self.assertEqual(self.face.prev_vertex(self.v1), self.v3)
        self.assertEqual(self.face.prev_vertex(self.v2), self.v1)
        self.assertEqual(self.face.prev_vertex(self.v3), self.v2)
