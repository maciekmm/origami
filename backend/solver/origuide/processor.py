from typing import List

from origuide.fold import FoldProducer, LogFoldEncoder, Fold, json
from origuide.geometry.geometry_models import *
from origuide.geometry.triangulation import triangulate
from origuide.solver import Solver


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
            face = Face(i, *face_vertices)  # TODO: ? This makes id in Face not unique (which might not be a problem)

            face_edges = zip(face_vertices, list(face_vertices[1:]) + [face_vertices[0]])
            for p in face_edges:
                v1 = p[0].id
                v2 = p[1].id

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


def read_fold(filename):
    with open(filename) as fold_file:
        return Fold(json.load(fold_file))


def normalize_bounding_box(vertices: List[Vertex], box_diag_len):
    """
    Normalizes vertices coordinates to lay within a bounding box
    """
    if len(vertices) == 0:
        return vertices

    scale_ref_len = box_diag_len / 2
    max_dist_v = max(vertices, key=lambda v: v.pos.length)
    scale_factor = max_dist_v.pos.length / scale_ref_len
    def scale_v(v):
        v.pos /= scale_factor
        return v

    return list(map(scale_v, vertices))


def bounding_box(vertices: List[Vertex]):
    min_x, min_y, min_z = math.inf, math.inf, math.inf
    max_x, max_y, max_z = -math.inf, -math.inf, -math.inf

    for v in vertices:
        if v.x < min_x:
            min_x = v.x
        if v.x > max_x:
            max_x = v.x

        if v.y < min_y:
            min_y = v.y
        if v.y > max_y:
            max_y = v.y

        if v.z < min_z:
            min_z = v.z
        if v.z > max_z:
            max_z = v.z

    return min_x, min_y, min_z, max_x, max_y, max_z


def translate_to_origin(vertices: List[Vertex]):
    if len(vertices) == 0:
        return vertices

    min_x, min_y, min_z, max_x, max_y, max_z = bounding_box(vertices)
    mid_x = (min_x + max_x) / 2
    mid_y = (min_y + max_y) / 2
    mid_z = (min_z + max_z) / 2

    trans_vec = vector_from_to(Vector3(mid_x, mid_y, mid_z), Vector3(0, 0, 0))

    def translate_v(v):
        v.pos += trans_vec
        return v

    return list(map(translate_v, vertices))


def solve_fold(fold_path):
    fold = read_fold(fold_path)
    first_frame = fold.frames[0]

    vertices = create_vertices(first_frame.vertices)
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
