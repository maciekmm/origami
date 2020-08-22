import json
import unittest

from fold_producer import Fold, FoldProducer
from geometry.geometry_models import Vertex


class TestEncodeTransition(unittest.TestCase):
    def setUp(self):
        base = Fold(
            json.loads("""
{
  "file_spec": 1,
  "file_creator": "",
  "file_author": "",
  "file_classes": ["animation", "origuide:guide"],
  "frame_title": "",
  "frame_classes": [
      "creasePattern",
      "origuide:steady_state"
  ],
  "frame_attributes": ["3D"],
  "vertices_coords": [ [0, 0, 0] ],
  "faces_vertices": [],
  "edges_vertices": [],
  "edges_assignment": []
}
            """)
        )

        self.producer = FoldProducer(base)
        self.producer.accept([Vertex(1, 1, 1, 1)])
        for _ in range(8):
            self.producer.accept([Vertex(-2, 2, 2, 2)])
        self.producer.accept([Vertex(3, 3, 3, 3)])

    def test_drops_frames(self):
        self.assertEqual(len(self.producer.transitions), 11)
        self.producer.encode_transition(8)
        self.producer.next_transition()

        self.assertEqual(len(self.producer.transitions), 5)

    def test_always_includes_first_and_last(self):
        self.producer.encode_transition(8)
        self.producer.next_transition()

        self.assertEqual(self.producer.transitions[0]['vertices_coords'], [[0, 0, 0]])
        self.assertEqual(self.producer.transitions[1]['vertices_coords'], [[1, 1, 1]])
        self.assertEqual(self.producer.transitions[2]['vertices_coords'], [[2, 2, 2]])
        self.assertEqual(self.producer.transitions[3]['vertices_coords'], [[3, 3, 3]])

    def test_does_not_include_last_twice(self):
        self.producer.encode_transition(5)
        self.assertEqual(self.producer.transitions[-1]['vertices_coords'], [[3, 3, 3]])
        self.assertNotEqual(self.producer.transitions[-2]['vertices_coords'], [[3, 3, 3]])

    def test_assigns_frame_parents(self):
        self.producer.encode_transition(8)
        self.producer.next_transition()
        for _ in range(10):
            self.producer.accept([Vertex(4, 4, 4, 4)])
        self.producer.encode_transition(8)

        for i in range(1, len(self.producer.transitions)):
            self.assertEqual(self.producer.transitions[i]['frame_parent'], i-1)
