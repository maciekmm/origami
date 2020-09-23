import unittest

from interaction.beam_force import set_all_beam_forces
from geometry.generic_models import Vector3
from geometry.generic_tools import same_direction_vec
from geometry.geometry_models import Edge, Vertex, EDGE_BOUNDARY


class TestBeamForce(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 0, 0, 0)
        self.v2 = Vertex(1, 2, 0, 0)
        self.edge = Edge(0, self.v1, self.v2, EDGE_BOUNDARY)

    def test_is_zero_if_position_did_not_change(self):
        set_all_beam_forces([self.edge])
        self.assertEqual(self.v1.total_force(), Vector3(0, 0, 0))

    def test_creates_shrinking_force(self):
        self.v2.x = 4
        set_all_beam_forces([self.edge])
        self.assertTrue(same_direction_vec(self.v1.total_force(), Vector3(1, 0, 0)))
        self.assertTrue(same_direction_vec(self.v2.total_force(), Vector3(-1, 0, 0)))

    def test_creates_expanding_force(self):
        self.v2.x = 1
        set_all_beam_forces([self.edge])
        self.assertTrue(same_direction_vec(self.v1.total_force(), Vector3(-1, 0, 0)))
        self.assertTrue(same_direction_vec(self.v2.total_force(), Vector3(1, 0, 0)))

