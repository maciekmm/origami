import numpy as np

from config import CONFIG
from generic_models import ForceName
from geometry_models import Face, Vertex
from geometry_tools import vector_from_to


def set_face_force(face: Face):
    k_face = CONFIG['FACE_STIFFNESS']
    for (v, a) in zip(face.vertices, face.alfa0):
        set_angle_face_force(v, a, face, k_face)


def set_angle_face_force(angle_vertex: Vertex, alfa0, face: Face, k_face):
    alfa = face.angle_for_vertex(angle_vertex)

    p1 = face.prev_vertex(angle_vertex)
    p2 = angle_vertex
    p3 = face.next_vertex(angle_vertex)

    c = k_face * (alfa0 - alfa)

    p21 = vector_from_to(p2, p1).vec
    p21_len = np.linalg.norm(p21)
    p23 = vector_from_to(p2, p3).vec
    p23_len = np.linalg.norm(p23)

    normal = face.normal.vec

    dp1 = normal * p21 / p21_len
    dp2 = -normal * p21 / p21_len + normal * p23 / p23_len
    dp3 = -normal * p23 / p23_len

    f1 = c * dp1
    f2 = c * dp2
    f3 = c * dp3

    p1.set_force(ForceName.FACE, f1)
    p2.set_force(ForceName.FACE, f2)
    p3.set_force(ForceName.FACE, f3)


def set_all_face_forces(faces):
    for face in faces:
        set_face_force(face)
