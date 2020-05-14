import numpy as np

from generic_models import Vector3


def vector_from_to(v1: Vector3, v2: Vector3) -> Vector3:
    return v2 - v1


def normalize(v: Vector3) -> Vector3:
    res = Vector3.from_vec(v.vec)
    res.vec = res.vec / np.linalg.norm(res.vec)

    return res


def distance(v1: Vector3, v2: Vector3) -> float:
    return np.linalg.norm((v1 - v2).vec)


def plane_normal(v1: Vector3, v2: Vector3, v3: Vector3) -> Vector3:
    w1 = vector_from_to(v1, v2)
    w2 = vector_from_to(v1, v3)

    n = np.cross(w1.vec, w2.vec)
    return Vector3.from_vec(n / np.linalg.norm(n))


def vector_angle(v1: Vector3, v2: Vector3) -> float:
    return np.arccos(np.dot(normalize(v1).vec, normalize(v2).vec))


def triangle_height(project_onto: Vector3, project_from: Vector3) -> float:
    """
    Calculates height of a triangle spanned by 2 vectors

    @param project_from: vector which tip will point to a vertex containing the height
    @param project_onto: vector which contains the side of the triangle
    """
    alfa = vector_angle(project_onto, project_from)
    return np.sin(alfa) * np.linalg.norm(project_from.vec)


def cot(angle):
    return 1.0 / np.tan(angle)
