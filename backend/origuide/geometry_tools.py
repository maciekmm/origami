import numpy as np

from generic_models import Vector3


def vector_from_to(v1: Vector3, v2: Vector3) -> Vector3:
    return Vector3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z)


def normalize(v: Vector3) -> Vector3:
    res = Vector3.from_vec(v.vec)
    res.vec = res.vec / np.linalg.norm(res.vec)

    return res


def plane_normal(v1: Vector3, v2: Vector3, v3: Vector3) -> Vector3:
    w1 = vector_from_to(v1, v2)
    w2 = vector_from_to(v1, v3)

    n = np.cross(w1.vec, w2.vec)
    return Vector3.from_vec(n / np.linalg.norm(n))


def vector_angle(v1: Vector3, v2: Vector3) -> float:
    return np.arccos(np.clip(np.dot(v1.vec, v2.vec), -1.0, 1.0))


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
