import math

from origuide.config import CONFIG
from origuide.geometry.geometry_models import Edge, EDGE_MOUNTAIN, EDGE_VALLEY,\
    EDGE_BOUNDARY, EDGE_FLAT, EDGE_UNKNOWN, Face, ForceName
from origuide.geometry.generic_tools import vector_from_to, triangle_height, cot

TWO_PI = 2 * math.pi
ANGLE_FLIP_THRESHOLD = 5.0


def set_crease_force(edge: Edge):
    if edge.assignment == EDGE_BOUNDARY:
        return

    if edge.face_left is None or edge.face_right is None:
        raise RuntimeError("edge should have 2 faces assigned")

    if edge.assignment == EDGE_MOUNTAIN or edge.assignment == EDGE_VALLEY:
        k_crease = edge.l0 * CONFIG['FOLD_STIFFNESS']
    elif edge.assignment == EDGE_FLAT or edge.assignment == EDGE_UNKNOWN:
        k_crease = edge.l0 * CONFIG['FACET_STIFFNESS']
    else:
        raise RuntimeError("wrong face assignment: ", edge.assignment)

    theta = edge.faces_angle()
    theta_target = edge.target_angle

    # This accounts for the case when faces can "flip" (inter-penetrate to the other side)
    # That is - the angle diff is too huge to be physically possible
    # so we account for it by adding or subtracting the full flip angle
    # The diff will never be more than 2 * pi, since we're talking about a
    # dihedral angle between 2 faces.
    # It's in the range [0, 2pi] or [-2pi, 0] depending on the edge.
    diff = theta - edge.last_theta
    if diff < -ANGLE_FLIP_THRESHOLD:
        diff += TWO_PI
    elif diff > ANGLE_FLIP_THRESHOLD:
        diff -= TWO_PI
    theta = edge.last_theta + diff

    c = k_crease * (theta_target - theta)

    left_face = edge.face_left
    right_face = edge.face_right

    p1 = find_vertex_not_in_edge(right_face, edge)
    p2 = find_vertex_not_in_edge(left_face, edge)
    p3 = edge.v1
    p4 = edge.v2

    p32 = vector_from_to(p3.pos, p2.pos)
    p34 = vector_from_to(p3.pos, p4.pos)
    p31 = vector_from_to(p3.pos, p1.pos)

    h1 = triangle_height(p34, p31)
    h2 = triangle_height(p34, p32)

    # Angles names in convention xyz:
    # x - vertex at which angle is located
    # yz - other 2 vertices that span the triangle x belongs to
    alfa314 = right_face.angle_for_vertex(p3)
    alfa342 = left_face.angle_for_vertex(p3)
    alfa431 = right_face.angle_for_vertex(p4)
    alfa423 = left_face.angle_for_vertex(p4)

    dp1 = right_face.normal / h1
    dp2 = left_face.normal / h2

    mul1 = dp1 / (cot(alfa314) + cot(alfa431))
    mul2 = dp2 / (cot(alfa342) + cot(alfa423))

    dp3 = (-cot(alfa431) * mul1) + (-cot(alfa423) * mul2)
    dp4 = (-cot(alfa314) * mul1) + (-cot(alfa342) * mul2)

    f1 = c * dp1
    f2 = c * dp2
    f3 = c * dp3
    f4 = c * dp4

    p1.set_force(ForceName.CREASE, f1)
    p2.set_force(ForceName.CREASE, f2)
    p3.set_force(ForceName.CREASE, f3)
    p4.set_force(ForceName.CREASE, f4)

    edge.last_theta = theta


def find_vertex_not_in_edge(face: Face, edge: Edge):
    for v in face.vertices:
        if v != edge.v1 and v != edge.v2:
            return v

    raise RuntimeError("No vertex found")


def set_all_crease_forces(edges):
    for e in edges:
        set_crease_force(e)
