import numpy as np

from generic_models import Vector3


def vector_from_to(v1: Vector3, v2: Vector3) -> Vector3:
    return v2 - v1


def normalize(v: Vector3) -> Vector3:
    res = Vector3.from_vec(v.vec)
    res.vec = res.vec / np.linalg.norm(res.vec)
    return res


def norm(v: Vector3) -> float:
    return np.linalg.norm(v.vec)


def cross(v1: Vector3, v2: Vector3) -> Vector3:
    return Vector3.from_vec(np.cross(v1.vec, v2.vec))


def dot(v1: Vector3, v2: Vector3) -> float:
    return np.dot(v1.vec, v2.vec)


def distance(v1: Vector3, v2: Vector3) -> float:
    return np.linalg.norm((v1 - v2).vec)


def plane_normal(v1: Vector3, v2: Vector3, v3: Vector3) -> Vector3:
    """
    v1, v2, v3 - 3 points to form vectors rooted in v1
    """
    w1 = vector_from_to(v1, v2)
    w2 = vector_from_to(v1, v3)

    n = np.cross(w1.vec, w2.vec)
    return Vector3.from_vec(n / np.linalg.norm(n))


def vector_angle(v1: Vector3, v2: Vector3) -> float:
    return np.arctan2(norm(cross(v1, v2)), dot(v1, v2))


def signed_vector_angle(v1: Vector3, v2: Vector3, ref_n: Vector3) -> float:
    v1 = normalize(v1)
    v2 = normalize(v2)
    ref_n = normalize(ref_n)
    return np.arctan2(dot(cross(v1, v2), ref_n), dot(v1, v2))


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
