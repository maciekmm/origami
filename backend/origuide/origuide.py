import json
import sys

from beam_force import set_all_beam_forces
from crease_force import set_all_crease_forces
from face_force import set_all_face_forces
from geometry_models import *
from solver import Solver
from triangulation import triangulate


def read_fold(filename):
    with open(filename) as foldfile:
        content = json.load(foldfile)

        return {
            'vertices_coords': content['vertices_coords'],
            'faces_vertices': content['faces_vertices'],
            'edges_vertices': content['edges_vertices'],
            'edges_assignment': content['edges_assignment'],
        }


def create_vertices(coords):
    return list(map(lambda c: Vertex(c[0], c[1], c[2]), coords))


def create_edges(vertices, edges_vertices, edges_assignment):
    edges = []
    for i, edge_vertices in enumerate(edges_vertices):
        v1 = vertices[edge_vertices[0]]
        v2 = vertices[edge_vertices[1]]
        assignment = edges_assignment[i]
        edges.append(Edge(v1, v2, assignment))

    return edges


def create_faces(vertices, edges, faces_vertices):
    edges_bag = {}  # TODO: Think of a better solution for this edges_bag
    for e in edges:
        edges_bag[(tuple(e.v1.vec), tuple(e.v2.vec))] = e

    faces = []

    for i, vertices_index in enumerate(faces_vertices):
        face_to_triangulate = list(map(lambda x: vertices[x], vertices_index))

        triangles = triangulate(face_to_triangulate)

        for triangle in triangles:

            # TODO: HERE. FIX THIS!!! TRIANGULATION SHOULD NOT CREATE NEW VERTICES. IT BREAKS FORCE CALCULATION
            face_vertices = triangle

            face = Face(*triangle)

            face_edges = zip(face_vertices, np.roll(face_vertices, -1))
            for p in face_edges:
                v1 = tuple(p[0].vec)
                v2 = tuple(p[1].vec)

                # Introduce new edges
                if (v1, v2) not in edges_bag and (v2, v1) not in edges_bag:
                    edge = Edge(p[0], p[1], EDGE_FLAT)
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
    # TODO: There might be an issue of edges and faces orientation (not handled correctly)
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

    content = read_fold('../../assets/solver_test_models/square.fold')

    vertices = create_vertices(content['vertices_coords'])

    if CONFIG['DEBUG_ENABLED']:
        print('Vertices read...')
        for v in vertices:
            print(v)
        print()

    edges = create_edges(vertices,
                         content['edges_vertices'],
                         content['edges_assignment'])

    faces = create_faces(vertices, edges, content['faces_vertices'])

    # TODO:DEBUG
    vertices[0].x = -2.0
    vertices[0].y = -2.0

    # TODO: Maybe some graph would be a more appropriate structure?

    if CONFIG['DEBUG_ENABLED']:
        print('Edges read...')
        for e in edges:
            print(e)
            print('EDGE faces: ', e.face_left, e.face_right)
        print()

    if CONFIG['DEBUG_ENABLED']:
        print('Faces read...')
        for f in faces:
            print(f)
        print()

    solver = Solver(vertices, edges, faces)
    solver.solve()


def test_beam():
    v1 = Vertex(0, -1, 0)
    v2 = Vertex(0, 1, 0)

    vertices = [v1, v2]
    edge = Edge(v1, v2, EDGE_FLAT)

    v1.y = -2

    solver = Solver(vertices, [edge], [])
    solver.solve()


if __name__ == '__main__':
    test_beam()
    # playground()
    # main()
