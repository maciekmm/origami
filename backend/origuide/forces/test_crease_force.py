import unittest

from forces.crease_force import set_all_crease_forces
from geometry.generic_models import Vector3
from geometry.generic_tools import same_direction_vec
from geometry.geometry_models import Vertex, Edge, EDGE_UNKNOWN, Face, EDGE_VALLEY, EDGE_MOUNTAIN, angle_from_assignment


class TestCreaseForce(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 1, -1, 0)
        self.v2 = Vertex(1, 1, 1, 0)
        self.v3 = Vertex(2, -1, 1, 0)
        self.v4 = Vertex(3, -1, -1, 0)
        self.face1 = Face(0, self.v1, self.v2, self.v4)
        self.face2 = Face(1, self.v2, self.v3, self.v4)
        self.edge = Edge(2, self.v4, self.v2, EDGE_UNKNOWN)
        self.edge.face_right = self.face1
        self.edge.face_left = self.face2

    def test_is_zero_if_is_not_being_folded(self):
        set_all_crease_forces([self.edge])

        self.assertEqual(self.v1.total_force(), Vector3(0, 0, 0))
        self.assertEqual(self.v2.total_force(), Vector3(0, 0, 0))
        self.assertEqual(self.v3.total_force(), Vector3(0, 0, 0))
        self.assertEqual(self.v4.total_force(), Vector3(0, 0, 0))

    def test_creates_upward_force_for_valley_assignment(self):
        self.edge.assignment = EDGE_VALLEY
        self.edge.target_angle = angle_from_assignment(self.edge.assignment)
        set_all_crease_forces([self.edge])

        self.assertTrue(same_direction_vec(self.v1.total_force(), Vector3(0, 0, 1)))
        self.assertTrue(same_direction_vec(self.v2.total_force(), Vector3(0, 0, -1)))
        self.assertTrue(same_direction_vec(self.v3.total_force(), Vector3(0, 0, 1)))
        self.assertTrue(same_direction_vec(self.v4.total_force(), Vector3(0, 0, -1)))

    def test_creates_downwards_force_for_mountain_assignment(self):
        self.edge.assignment = EDGE_MOUNTAIN
        self.edge.target_angle = angle_from_assignment(self.edge.assignment)
        set_all_crease_forces([self.edge])

        self.assertTrue(same_direction_vec(self.v1.total_force(), Vector3(0, 0, -1)))
        self.assertTrue(same_direction_vec(self.v2.total_force(), Vector3(0, 0, 1)))
        self.assertTrue(same_direction_vec(self.v3.total_force(), Vector3(0, 0, -1)))
        self.assertTrue(same_direction_vec(self.v4.total_force(), Vector3(0, 0, 1)))

