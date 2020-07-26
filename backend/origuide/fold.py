import json


def is_steady_state(frame):
    return "origuide:steady_state" in frame['frame_classes']


def extract_root_frame(root):
    return {
        'vertices_coords': root['vertices_coords'],
        'faces_vertices': root['faces_vertices'],
        'edges_vertices': root['edges_vertices'],
        'edges_assignment': root['edges_assignment'],
        'frame_classes': root.get('frame_classes')
    }


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


class Fold(Frame):
    def __init__(self, json_representation):
        super(Fold, self).__init__(json_representation)
        self.raw = json_representation
        self.root_frame = Frame(extract_root_frame(self.raw))
        self.frames = [self.root_frame] + [Frame(frame) for frame in self.raw.get('file_frames', [])]
        self.steady_states = list(
            filter(lambda frame: frame.is_steady, self.frames)
        )


def read_fold(filename):
    with open(filename) as fold_file:
        return Fold(json.load(fold_file))
