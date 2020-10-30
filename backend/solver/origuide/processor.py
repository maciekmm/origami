import json

from origuide.fold import FoldProducer, LogFoldEncoder, Fold
from origuide.geometry.geometry_models import *
from origuide.geometry.preprocessing import create_vertices, translate_to_origin, normalize_bounding_box, create_edges, \
    create_faces
from origuide.solver import Solver


def _read_fold(filename):
    with open(filename) as fold_file:
        return Fold(json.load(fold_file))


def solve_fold(fold_path):
    fold = _read_fold(fold_path)
    first_frame = fold.frames[0]

    vertices = create_vertices(first_frame.vertices)

    if CONFIG['NORMALIZE']:
        vertices = translate_to_origin(vertices)
        vertices = normalize_bounding_box(vertices, CONFIG['BOUNDING_BOX_DIAG_LEN'])
        
    fold.update_root_frame_vertices(list(map(lambda v: v.pos.vec, vertices)))

    edges = create_edges(vertices,
                         first_frame.edges,
                         first_frame.assignments)

    faces = create_faces(vertices, edges, first_frame.faces)

    fold_producer = FoldProducer(fold, LogFoldEncoder(frame_drop_rate=4,
                                                      frame_drop_multiplier=1.25,
                                                      frame_drop_change_iter=40)
                                 )

    for steady_state in fold.steady_states:
        for edge in edges:
            if edge.id == -1:
                continue
            edge.assignment = steady_state.assignments[edge.id]

        solver = Solver(vertices, edges, faces, steady_state.edges_fold_angles)
        solver.solve(fold_producer)
        fold_producer.next_transition()

    return fold_producer.produce()
