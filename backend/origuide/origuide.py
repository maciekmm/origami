import json
import sys

from beam_force import set_all_beam_forces
from models import *


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
    for i, edge_verteices in enumerate(edges_vertices):
        v1 = vertices[edge_verteices[0]]
        v2 = vertices[edge_verteices[1]]
        assignment = edges_assignment[i]
        edges.append(Edge(v1, v2, assignment))

    return edges


def create_faces(vertices, faces_vertices):
    faces = []

    for i, face_verteices in enumerate(faces_vertices):
        v1 = vertices[face_verteices[0]]
        v2 = vertices[face_verteices[1]]
        v3 = vertices[face_verteices[2]]
        faces.append(Face(v1, v2, v3))

    return faces


def main():
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

    content = read_fold('../../assets/models/diagonal_fold.fold')

    vertices = create_vertices(content['vertices_coords'])
    edges = create_edges(vertices,
                         content['edges_vertices'],
                         content['edges_assignment'])
    faces = create_faces(vertices, content['faces_vertices'])

    for v in vertices:
        print(v)
    print()

    for e in edges:
        print(e)
    print()

    for f in faces:
        print(f)
    print()

    set_all_beam_forces(edges)


if __name__ == '__main__':
    main()
