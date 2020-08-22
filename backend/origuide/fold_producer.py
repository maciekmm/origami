import copy
from typing import List
from geometry.geometry_models import Vertex
from fold import Fold
import json


# TODO: TESTS!!!
class FoldProducer:

    def __init__(self, base: Fold):
        self.step = 0
        self.last_steady_frame = 0
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
        self.last_steady_frame = len(self.transitions) - 1

    def encode_transition(self,
                          frame_drop_rate=4,
                          frame_drop_multiplier=2,
                          frame_drop_change_iter=10):
        collected_frames = []
        cur_idx = self.last_steady_frame + 1
        iters = 0
        while cur_idx < len(self.transitions) - 1:  # -1 so that it does not include the last frame
            collected_frames.append(self.transitions[cur_idx])
            cur_idx += frame_drop_rate
            iters += 1
            if iters % frame_drop_change_iter == 0:
                frame_drop_rate = int(frame_drop_rate * frame_drop_multiplier)

        collected_frames.append(self.transitions[-1])

        collected_frames[0]["frame_parent"] = self.last_steady_frame
        for i in range(1, len(collected_frames)):
            collected_frames[i]["frame_parent"] = collected_frames[i - 1]["frame_parent"] + 1

        self.transitions = self.transitions[:self.last_steady_frame + 1] + collected_frames

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
