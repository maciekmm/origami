import json
import sys

from beam_force import set_all_beam_forces
from crease_force import set_all_crease_forces
from face_force import set_all_face_forces
from geometry_models import *


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


def create_faces(vertices, faces_vertices, edges_map):
    faces = []

    for i, face_vertices in enumerate(faces_vertices):
        v1 = vertices[face_vertices[0]]
        v2 = vertices[face_vertices[1]]
        v3 = vertices[face_vertices[2]]

        face = Face(v1, v2, v3)
        faces.append(face)

        # TODO: If sth is messed up, it might be that faces/edges orientation matters

        if (v1, v2) in edges_map:
            edges_map[(v1, v2)].face1 = face
        else:
            edges_map[(v2, v1)].face2 = face

        if (v2, v3) in edges_map:
            edges_map[(v2, v3)].face1 = face
        else:
            edges_map[(v3, v2)].face2 = face

        if (v3, v1) in edges_map:
            edges_map[(v3, v1)].face1 = face
        else:
            edges_map[(v1, v3)].face2 = face

    return faces


def main():
    # TODO: There might be an issue of edges and faces orientation (not handled correctly)
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

    content = read_fold('../../assets/models/crane.fold')

    vertices = create_vertices(content['vertices_coords'])
    edges = create_edges(vertices,
                         content['edges_vertices'],
                         content['edges_assignment'])

    edges_map = {}
    for e in edges:
        edges_map[(e.v1, e.v2)] = e

    faces = create_faces(vertices, content['faces_vertices'], edges_map)

    # TODO: Maybe some graph would be a more appropriate structure?

    # for v in vertices:
    #     print(v)
    # print()
    #
    # for e in edges:
    #     print(e)
    #     print('EDGE faces: ', e.face1, e.face2)
    # print()
    #
    # for f in faces:
    #     print(f)
    # print()

    set_all_beam_forces(edges)
    set_all_crease_forces(edges)
    set_all_face_forces(faces)

    # print(faces[0].normal)


if __name__ == '__main__':
    main()
