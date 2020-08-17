import sys

from fold import read_fold
from geometry.geometry_models import *
from solver import Solver
from geometry.triangulation import triangulate
from fold_producer import FoldProducer


def create_vertices(coords):
    return [Vertex(iden, c[0], c[1], c[2]) for iden, c in enumerate(coords)]

def create_edges(vertices, edges_vertices, edges_assignment):
    edges = []
    for i, edge_vertices in enumerate(edges_vertices):
        v1 = vertices[edge_vertices[0]]
        v2 = vertices[edge_vertices[1]]
        assignment = edges_assignment[i]
        edges.append(Edge(i, v1, v2, assignment))

    return edges


def create_faces(vertices, edges, faces_vertices):
    edges_bag = {}  # TODO: Think of a better solution for this edges_bag
    for e in edges:
        edges_bag[(e.v1.id, e.v2.id)] = e

    faces = []

    for i, vertices_index in enumerate(faces_vertices):
        face_to_triangulate = list(map(lambda x: vertices[x], vertices_index))

        triangles = triangulate(face_to_triangulate)

        for face_vertices in triangles:
            face = Face(i, *face_vertices) # TODO: ? This makes id in Face not unique (which might not be a problem)

            face_edges = zip(face_vertices, np.roll(face_vertices, -1))
            for p in face_edges:
                v1 = p[0].id#tuple(p[0].pos)
                v2 = p[1].id#tuple(p[1].pos)

                # Introduce new edges
                if (v1, v2) not in edges_bag and (v2, v1) not in edges_bag:
                    edge = Edge(-1, p[0], p[1], EDGE_FLAT)
                    edges.append(edge)
                    edges_bag[(v1, v2)] = edge

                if (v1, v2) in edges_bag:
                    edges_bag[(v1, v2)].face_left = face
                elif (v2, v1) in edges_bag:
                    edges_bag[(v2, v1)].face_right = face
                else:
                    raise RuntimeError("Impossible. You messed up edges map. ")

            faces.append(face)

    return faces


def main():
    # fold = read_fold('../../assets/solver_test_models/diagonal_fold_twice_undrve.fold')
    # fold = read_fold('../../assets/solver_test_models/diagonal_fold_twice_from_flat_undriven.fold')
    # fold = read_fold('../../assets/solver_test_models/fold_unfold_half.fold')
    # fold = read_fold('../../assets/solver_test_models/tulip_base.fold')
    # fold = read_fold('../../assets/solver_test_models/tulip_base_amanda.fold')
    # fold = read_fold('../../assets/models/flappingBird.fold')
    # fold = read_fold('../../assets/models/traditionalCrane_foldangle.fold')
    fold = read_fold('../../assets/solver_test_models/diagonal_fold_target_angle.fold')

    vertices = create_vertices(fold.vertices)

    fold_producer = FoldProducer(fold)

    edges = create_edges(vertices,
                         fold.edges,
                         fold.assignments)

    faces = create_faces(vertices, edges, fold.faces)

    # TODO: Maybe some graph would be a more appropriate structure?
    # IDEA: Create vertices, beams, etc "globally", and assign only their IDs to some more advanced objects
    # that can extend the behavior

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

            # input()

        solver = Solver(vertices, edges, faces, steady_state.edges_fold_angles)

        # TODO: PROFILING
        # import cProfile
        # cProfile.runctx('solver.solve(fold_producer)', None, locals())
        # TODO END

        solver.solve(fold_producer)
        fold_producer.next_transition()

    with open("/tmp/test.fold", "w") as file:
        file.write(fold_producer.save())

def test_beam():
    v1 = Vertex(0, -1, 0)
    v2 = Vertex(0, 1, 0)

    vertices = [v1, v2]
    edge = Edge(v1, v2, EDGE_FLAT)

    v1.y = -2

    solver = Solver(vertices, [edge], [])
    solver.solve()


if __name__ == '__main__':
    # test_beam()
    main()
