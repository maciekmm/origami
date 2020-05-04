from config import CONFIG
from generic_models import ForceName, Vector3
from geometry_models import Edge, EDGE_MOUNTAIN, EDGE_VALLEY, angle_from_assignment, Face
from geometry_tools import vector_from_to, triangle_height, cot


def set_crease_force(edge: Edge):
    # TODO: Add FACET handling here? (Driven by triangulation facet creases)
    if edge.assignment != EDGE_MOUNTAIN and edge.assignment != EDGE_VALLEY:
        return

    if edge.face_left is None or edge.face_right is None:
        raise RuntimeError("edge should have 2 faces assigned")

    if edge.assignment == EDGE_MOUNTAIN or edge.assignment == EDGE_VALLEY:
        k_crease = edge.l0 * CONFIG['FOLD_STIFFNESS']
    else:
        return

    theta = edge.face_angle()
    theta_target = angle_from_assignment(edge.assignment)

    c = k_crease * (theta_target - theta)

    left_face = edge.face_left
    right_face = edge.face_right

    p1 = find_vertex_not_in_edge(left_face, edge)
    p2 = find_vertex_not_in_edge(right_face, edge)
    p3 = edge.v1
    p4 = edge.v2

    p32 = vector_from_to(p3.vec, p2.vec)
    p34 = vector_from_to(p3.vec, p4.vec)
    p31 = vector_from_to(p3.vec, p1.vec)

    h1 = triangle_height(p34, p31)
    h2 = triangle_height(p34, p32)

    alfa314 = left_face.angle_for_vertex(p3)
    alfa342 = right_face.angle_for_vertex(p3)
    alfa431 = left_face.angle_for_vertex(p4)
    alfa423 = right_face.angle_for_vertex(p4)

    dp1 = left_face.normal.vec / h1
    dp2 = right_face.normal.vec / h2

    mul1 = dp1 / (cot(alfa314) + cot(alfa431))
    mul2 = dp2 / (cot(alfa342) + cot(alfa423))

    dp3 = (-cot(alfa431) * mul1) + (-cot(alfa423) * mul2)
    dp4 = (-cot(alfa314) * mul1) + (-cot(alfa342) * mul2)

    f1 = c * dp1
    f2 = c * dp2
    f3 = c * dp3
    f4 = c * dp4

    p1.set_force(ForceName.CREASE, Vector3.from_vec(f1))
    p2.set_force(ForceName.CREASE, Vector3.from_vec(f2))
    p3.set_force(ForceName.CREASE, Vector3.from_vec(f3))
    p4.set_force(ForceName.CREASE, Vector3.from_vec(f4))


def find_vertex_not_in_edge(face: Face, edge: Edge):
    for v in face.vertices:
        if v != edge.v1 and v != edge.v2:
            return v

    raise RuntimeError("No vertex found")


def set_all_crease_forces(edges):
    for e in edges:
        set_crease_force(e)
