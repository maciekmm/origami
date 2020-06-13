import numpy as np

from geometry.generic_models import Vector3


def vector_from_to(v1: Vector3, v2: Vector3) -> Vector3:
    return v2 - v1


def normalize(v: Vector3) -> Vector3:
    v_len = v.length
    if v_len == 0:
        return v
    return Vector3.from_vec(v.vec / v_len)


def cross(v1: Vector3, v2: Vector3) -> Vector3:
    return Vector3.from_vec(np.cross(v1.vec, v2.vec))


def dot(v1: Vector3, v2: Vector3) -> float:
    return np.dot(v1.vec, v2.vec)


def distance(v1: Vector3, v2: Vector3) -> float:
    return (v1 - v2).length


def plane_normal(v1: Vector3, v2: Vector3, v3: Vector3) -> Vector3:
    """
    v1, v2, v3 - 3 points to form vectors rooted in v1
    """
    w1 = vector_from_to(v1, v2)
    w2 = vector_from_to(v1, v3)

    n = np.cross(w1.vec, w2.vec)
    return Vector3.from_vec(n / np.linalg.norm(n))


def vector_angle(v1: Vector3, v2: Vector3) -> float:
    return np.arctan2(cross(v1, v2).length, dot(v1, v2))


def signed_vector_angle(v1: Vector3, v2: Vector3, ref_n: Vector3) -> float:
    v1 = normalize(v1)
    v2 = normalize(v2)
    ref_n = normalize(ref_n)
    return np.arctan2(dot(cross(v1, v2), ref_n), dot(v1, v2))


def triangle_height(project_onto: Vector3, project_from: Vector3) -> float:
    """
    Calculates height of a triangle spanned by 2 vectors

    @param project_from: vector which tip points to a vertex,
    from which the height is dropped
    @param project_onto: vector which contains the side of the triangle,
    onto which the height id dropped
    """
    alfa = vector_angle(project_onto, project_from)
    return np.sin(alfa) * project_from.length


def cot(angle):
    return 1.0 / np.tan(angle)
