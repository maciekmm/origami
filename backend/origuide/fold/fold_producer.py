import copy
from typing import List
from geometry.geometry_models import Vertex
from fold import Fold
from .fold_encoder import FoldEncoder
import json


class FoldProducer:
    def __init__(self, base: Fold, encoder: FoldEncoder):
        self.step = 0
        self.last_steady_frame = 0
        self.base = copy.deepcopy(base)
        self.transitions = [
            base.root_frame.raw
        ]
        self.encoder = encoder

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
        self.last_steady_frame = len(self.transitions) - 1
        self.encoder.next_step()

    def accept(self, vertices: List[Vertex], last_step=False):
        frame = {
            "frame_inherit": True,
            "frame_parent": len(self.transitions) - 1,
            "vertices_coords": list(map(lambda x: list(x.pos.vec), vertices))
        }
        encoded = self.encoder.encode(frame, last_step)
        self.encoder.advance()
        if encoded is not None:
            self.transitions.append(encoded)

    def save(self):
        self.base.raw['file_frames'] = self.transitions[1:]
        return json.dumps(self.base.raw)
