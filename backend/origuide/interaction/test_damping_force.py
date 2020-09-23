import unittest

from interaction.damping_force import set_all_damping_forces
from geometry.generic_models import Vector3
from geometry.generic_tools import same_direction_vec
from geometry.geometry_models import Vertex, Edge, EDGE_FLAT


class TestDampingForce(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 0, 0, 0)
        self.v2 = Vertex(1, 1, 1, 0)
        self.edge = Edge(0, self.v1, self.v2, EDGE_FLAT)

    def test_is_zero_if_velocity_is_zero(self):
        set_all_damping_forces([self.edge])
        self.assertEqual(self.v1.total_force(), Vector3(0, 0, 0))
        self.assertEqual(self.v2.total_force(), Vector3(0, 0, 0))

    def test_creates_equal_forces_when_velocity_changes(self):
        self.v1.velocity = Vector3(-1, 0, 0)
        self.v2.velocity = Vector3(1, 0, 0)

        set_all_damping_forces([self.edge])

        self.assertEqual(self.v1.total_force(), -self.v2.total_force())
        self.assertTrue(same_direction_vec(self.v1.total_force(), Vector3(1, 0, 0)))
        self.assertTrue(same_direction_vec(self.v2.total_force(), Vector3(-1, 0, 0)))
