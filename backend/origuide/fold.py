import json


def read_fold(filename):
    with open(filename) as foldfile:
        content = json.load(foldfile)

        return {
            'vertices_coords': content['vertices_coords'],
            'faces_vertices': content['faces_vertices'],
            'edges_vertices': content['edges_vertices'],
            'edges_assignment': content['edges_assignment'],
        }