import sys

from origuide.fold import read_fold, FoldProducer, LogFoldEncoder
from origuide.geometry.geometry_models import *
from origuide.loader import create_vertices, create_edges, create_faces
from origuide.solver import Solver


def main():
    if len(sys.argv) != 2:
        print('Usage: python main.py <fold_file>')
        sys.exit(1)

    fold_path = sys.argv[1]
    fold = read_fold(fold_path)

    vertices = create_vertices(fold.vertices)

    fold_producer = FoldProducer(fold, LogFoldEncoder(frame_drop_rate=4,
                                                      frame_drop_multiplier=1.25,
                                                      frame_drop_change_iter=40)
                                 )

    edges = create_edges(vertices,
                         fold.edges,
                         fold.assignments)

    faces = create_faces(vertices, edges, fold.faces)

    for steady_state in fold.steady_states:
        # TODO: only assignments change between frames?
        for edge in edges:
            if edge.id == -1:
                continue
            edge.assignment = steady_state.assignments[edge.id]

        if CONFIG['DEBUG']:
            print('STARTING NEW FOLDING PROCESS')
            for v in vertices:
                v.reset()

                print('Vertex: ', v)
                print('Forces: ', v.total_force())
                print('Velocity: ', v.velocity)
                print()
            print()

            print('EDGES: ')
            for e in edges:
                print(e)
                print('EDGE faces: ', e.face_left, e.face_right)
                print(f'l0 = {e.l0}, current length = {e.length}')
            print()

            print('FACES: ')
            for f in faces:
                print(f)
            print()

        solver = Solver(vertices, edges, faces, steady_state.edges_fold_angles)

        if CONFIG['PROFILE']:
            import cProfile
            cProfile.runctx('solver.solve(fold_producer)', None, locals(), sort='cumulative')
        else:
            solver.solve(fold_producer)

        fold_producer.next_transition()

    with open("/tmp/test.fold", "w") as file:
        file.write(fold_producer.produce())


if __name__ == '__main__':
    main()
