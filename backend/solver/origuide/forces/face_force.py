from origuide.config import CONFIG
from origuide.geometry.generic_models import Vector3
from origuide.geometry.geometry_models import Face, Vertex, ForceName
from origuide.geometry.generic_tools import vector_from_to, cross


def set_face_force(face: Face):
    k_face = CONFIG['FACE_STIFFNESS']
    for (v, a) in zip(face.vertices, face.alfa0):
        set_angle_face_force(v, a, face, k_face)


def set_angle_face_force(angle_vertex: Vertex, alfa0, face: Face, k_face):
    # TODO: For potential speedup - calculations for the whole face at one time
    alfa = face.angle_for_vertex(angle_vertex)

    p1 = face.prev_vertex(angle_vertex)
    p2 = angle_vertex
    p3 = face.next_vertex(angle_vertex)

    c = k_face * (alfa0 - alfa)

    p21 = vector_from_to(p2.pos, p1.pos)
    p21_len = p21.length
    p23 = vector_from_to(p2.pos, p3.pos)
    p23_len = p23.length

    normal = face.normal

    n_x_p21 = cross(normal, p21)
    n_x_p23 = cross(normal, p23)

    dp1 = n_x_p21 / p21_len
    dp2 = -n_x_p21 / p21_len + n_x_p23 / p23_len
    dp3 = -n_x_p23 / p23_len

    f1 = c * dp1
    f2 = c * dp2
    f3 = c * dp3

    p1.set_force(ForceName.FACE, Vector3.from_vec(f1))
    p2.set_force(ForceName.FACE, Vector3.from_vec(f2))
    p3.set_force(ForceName.FACE, Vector3.from_vec(f3))


def set_all_face_forces(faces):
    for face in faces:
        set_face_force(face)
