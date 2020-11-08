import math


def is_steady_state(frame):
    return "origuide:steady_state" in frame['frame_classes']


def extract_root_frame(root):
    frame = {k: v for k, v in root.items() if not k.startswith('file_')}
    return frame if frame != {} else None


class Frame:
    @staticmethod
    def _extend_vertices_coords(json_repr):
        # I am assuming there is only 2d and 3d CP case
        if json_repr.get('vertices_coords') is not None:
            json_repr['vertices_coords'] = \
                list(map(lambda v: v if len(v) == 3 else [v[0], v[1], 0], json_repr['vertices_coords']))

    def __init__(self, json_representation):
        Frame._extend_vertices_coords(json_representation)
        self.raw = json_representation

        self.is_steady = is_steady_state(self.raw)

    def update_vertices(self, vertices_coords):
        self.raw['vertices_coords'] = vertices_coords

    @property
    def vertices(self):
        return self.raw['vertices_coords']

    @property
    def edges(self):
        return self.raw['edges_vertices']

    @property
    def assignments(self):
        return self.raw['edges_assignment']

    @property
    def faces(self):
        return self.raw['faces_vertices']

    @property
    def edges_fold_angles(self):
        if 'edges_foldAngle' in self.raw:
            return self._preprocess_fold_angles(self.raw['edges_foldAngle'])
        return None

    def _preprocess_fold_angles(self, fold_angles):
        return list(map(lambda angle: math.radians(angle) if angle is not None else None, fold_angles))


class Fold:
    def __init__(self, json_representation):
        self.raw = json_representation
        self.frames = [Frame(frame) for frame in self.raw.get('file_frames', [])]

        maybe_root_frame = extract_root_frame(self.raw)
        if maybe_root_frame:
            self.frames = [Frame(maybe_root_frame)] + self.frames

        self.steady_states = list(
            filter(lambda frame: frame.is_steady, self.frames)
        )

    def update_root_frame_vertices(self, vertices):
        if len(self.frames) == 0:
            return

        self.frames[0].update_vertices(vertices)
