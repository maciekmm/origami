import unittest

from interaction.face_force import set_all_face_forces
from geometry.generic_models import Vector3
from geometry.generic_tools import same_direction_vec
from geometry.geometry_models import Vertex, Face


class TestFaceForce(unittest.TestCase):
    def setUp(self) -> None:
        self.v1 = Vertex(0, 1, 0, 0)
        self.v2 = Vertex(1, -1, 0, 0)
        self.v3 = Vertex(2, 0, 2, 0)
        self.face = Face(0, self.v1, self.v2, self.v3)

    def test_is_zero_if_no_position_changed(self):
        set_all_face_forces([self.face])
        self.assertEqual(self.v1.total_force(), Vector3(0, 0, 0))
        self.assertEqual(self.v2.total_force(), Vector3(0, 0, 0))
        self.assertEqual(self.v3.total_force(), Vector3(0, 0, 0))

    def test_creates_pulling_force_if_face_is_squished(self):
        self.v3.y = 1
        set_all_face_forces([self.face])
        self.assertTrue(same_direction_vec(self.v3.total_force(), Vector3(0, 1, 0)))

    def test_creates_pushing_force_if_face_is_expanded(self):
        self.v3.y = 3
        set_all_face_forces([self.face])
        self.assertTrue(same_direction_vec(self.v3.total_force(), Vector3(0, -1, 0)))
