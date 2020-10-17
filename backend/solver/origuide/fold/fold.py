import json


def is_steady_state(frame):
    return "origuide:steady_state" in frame['frame_classes']


def extract_root_frame(root):
    frame = {k: v for k, v in root.items() if not k.startswith('file_')}
    return frame if frame != {} else None


class Frame:
    def __init__(self, json_representation):
        self.raw = json_representation
        self.is_steady = is_steady_state(self.raw)

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
        if 'edges_foldAngles' in self.raw:
            return self.raw['edges_foldAngles']
        return None


class Fold(Frame):
    def __init__(self, json_representation):
        self._extend_vertices_coords(json_representation)
        super(Fold, self).__init__(json_representation)

        self.frames = [Frame(frame) for frame in self.raw.get('file_frames', [])]

        maybe_root_frame = extract_root_frame(self.raw)
        if maybe_root_frame:
            self.frames = [Frame(maybe_root_frame)] + self.frames

        self.steady_states = list(
            filter(lambda frame: frame.is_steady, self.frames)
        )

    def _extend_vertices_coords(self, json_representation):
        # I am assuming there is only 2d and 3d CP case
        json_representation['vertices_coords'] =\
            list(map(lambda v: v if len(v) == 3 else [v[0], v[1], 0], json_representation['vertices_coords']))

def read_fold(filename):
    with open(filename) as fold_file:
        return Fold(json.load(fold_file))
