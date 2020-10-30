import unittest

from origuide.geometry.generic_models import Vector3
from origuide.geometry.geometry_models import Vertex
from origuide.geometry.preprocessing import normalize_bounding_box, translate_to_origin
import math


class TestNormalizeBoundingBox(unittest.TestCase):
    def test_does_nothing_when_all_correctly_bound(self):
        verts = [Vertex(0, 0.0, 0.0, 0.0),
                 Vertex(1, 1.0, 1.0, 1.0)]
        normalized = normalize_bounding_box(verts, 2 * math.sqrt(3))
        self.assertEqual(list(map(lambda vert: vert.pos, normalized)), [Vector3(0, 0, 0), Vector3(1, 1, 1)])

    def test_does_nothing_for_vertices_on_the_edge(self):
        verts = [Vertex(1, 1.0, 1.0, 1.0),
                 Vertex(2, 1.0, 1.0, -1.0),
                 Vertex(4, 1.0, -1.0, 1.0),
                 Vertex(5, -1.0, 1.0, 1.0),
                 Vertex(6, -1.0, -1.0, 1.0),
                 Vertex(7, 1.0, -1.0, -1.0),
                 Vertex(8, -1.0, 1.0, -1.0),
                 Vertex(9, -1.0, -1.0, -1.0),
                 ]
        initial_positions = list(map(lambda v: v.pos, verts))
        normalized = normalize_bounding_box(verts, 2 * math.sqrt(3))
        self.assertEqual(initial_positions, list(map(lambda v: v.pos, normalized)))

    def test_normalize_bounding(self):
        verts = [Vertex(0, 1.0, 1.0, 1.0),
                 Vertex(1, -20.0, -20.0, -20.0)]
        scale_fac = verts[1].pos.length / 5.0
        normalized = normalize_bounding_box(verts, 10)
        self.assertEqual(normalized[0].pos, Vector3(1.0 / scale_fac, 1.0 / scale_fac, 1.0 / scale_fac))
        self.assertEqual(normalized[1].pos, Vector3(-20.0 / scale_fac, -20.0 / scale_fac, -20.0 / scale_fac))

    def test_zero_division_does_not_throw(self):
        verts = [Vertex(0, 0, 0, 0)]
        normalize_bounding_box(verts, 10)


class TestTranslateToOrigin(unittest.TestCase):
    def test_does_nothing_for_already_translated(self):
        verts = [Vertex(1, 1.0, 1.0, 1.0),
                 Vertex(2, 1.0, 1.0, -1.0),
                 Vertex(4, 1.0, -1.0, 1.0),
                 Vertex(5, -1.0, 1.0, 1.0),
                 Vertex(6, -1.0, -1.0, 1.0),
                 Vertex(7, 1.0, -1.0, -1.0),
                 Vertex(8, -1.0, 1.0, -1.0),
                 Vertex(9, -1.0, -1.0, -1.0),
                 ]
        initial_positions = list(map(lambda v: v.pos, verts))
        trans = list(translate_to_origin(verts))
        self.assertEqual(initial_positions, list(map(lambda v: v.pos, trans)))

    def test_translates_to_origin(self):
        verts = [Vertex(1, 2.0, 2.0, 1.0),
                 Vertex(2, 2.0, 2.0, -1.0),
                 Vertex(4, 2.0, 0.0, 1.0),
                 Vertex(5, -0.0, 2.0, 1.0),
                 Vertex(6, -0.0, 0.0, 1.0),
                 Vertex(7, 2.0, 0.0, -1.0),
                 Vertex(8, -0.0, 2.0, -1.0),
                 Vertex(9, -0.0, 0.0, -1.0),
                 ]
        trans = list(map(lambda v: v.pos, translate_to_origin(verts)))
        expected_trans = list(map(lambda v: v.pos, [Vertex(1, 1.0, 1.0, 1.0),
                                                    Vertex(2, 1.0, 1.0, -1.0),
                                                    Vertex(4, 1.0, -1.0, 1.0),
                                                    Vertex(5, -1.0, 1.0, 1.0),
                                                    Vertex(6, -1.0, -1.0, 1.0),
                                                    Vertex(7, 1.0, -1.0, -1.0),
                                                    Vertex(8, -1.0, 1.0, -1.0),
                                                    Vertex(9, -1.0, -1.0, -1.0),
                                                    ]))
        self.assertEqual(trans, expected_trans)
