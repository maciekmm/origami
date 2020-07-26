import copy
from typing import List
from geometry.geometry_models import Vertex
from fold import Fold
import json


class FoldProducer:

    def __init__(self, base: Fold):
        self.step = 0
        self.base = copy.deepcopy(base)
        self.transitions = [
            base.root_frame.raw
        ]

    def next_transition(self):
        self.step += 1
        if len(self.base.steady_states) < self.step:
            raise RuntimeError("No steady state to base transition on")

        self.transitions.append(
            {
                **self.base.steady_states[self.step - 1].raw,
                "frame_inherit": True,
                "frame_parent": len(self.transitions) - 1,
                "vertices_coords": self.transitions[-1]["vertices_coords"]
            }
        )

    def accept(self, vertices: List[Vertex]):
        self.transitions.append(
            {
                "frame_inherit": True,
                "frame_parent": len(self.transitions) - 1,
                "vertices_coords": list(map(lambda x: list(x.pos.vec), vertices))
            }
        )

    def save(self):
        self.base.raw['file_frames'] = self.transitions[1:]
        return json.dumps(self.base.raw)
