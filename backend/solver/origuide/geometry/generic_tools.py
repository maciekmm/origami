import math

from origuide.geometry.generic_models import Vector3


def vector_from_to(v1: Vector3, v2: Vector3) -> Vector3:
    return v2 - v1

def normalize(v: Vector3) -> Vector3:
    v_len = v.length
    if v_len == 0:
        return v
    return v / v_len


def cross(v1: Vector3, v2: Vector3) -> Vector3:
    vec1 = v1.vec
    vec2 = v2.vec

    res = [0,0,0]
    x = (vec1[1] * vec2[2] - vec1[2] * vec2[1])
    y = (vec1[2] * vec2[0] - vec1[0] * vec2[2])
    z = (vec1[0] * vec2[1] - vec1[1] * vec2[0])

    return Vector3(x, y, z)
    # return Vector3.from_vec(np.cross(v1.vec, v2.vec))


def dot(v1: Vector3, v2: Vector3) -> float:
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z


def distance(v1: Vector3, v2: Vector3) -> float:
    return (v1 - v2).length


def plane_normal(v1: Vector3, v2: Vector3, v3: Vector3) -> Vector3:
    """
    v1, v2, v3 - 3 points to form vectors rooted in v1 (v1 -> v2, and v1 -> v3)
    """
    w1 = vector_from_to(v1, v2)
    w2 = vector_from_to(v1, v3)

    n = cross(w1, w2)
    return normalize(n)
    # return Vector3.from_vec(n / np.linalg.norm(n))


def vector_angle(v1: Vector3, v2: Vector3) -> float:
    return math.atan2(cross(v1, v2).length, dot(v1, v2))


def signed_vector_angle(v1: Vector3, v2: Vector3, ref_n: Vector3) -> float:
    v1 = normalize(v1)
    v2 = normalize(v2)
    ref_n = normalize(ref_n)
    return math.atan2(dot(cross(v1, v2), ref_n), dot(v1, v2))

    # TODO: Just checking what ORIGAMI simulator seems to be doing differently
    # v1 = normalize(v1)
    # v2 = normalize(v2)
    # ref_n = normalize(ref_n)

    # x = dot(v1, v2)
    # y = dot(cross(v1, ref_n), v2)

    # return np.arctan2(y, x)


def triangle_height(project_onto: Vector3, project_from: Vector3) -> float:
    """
    Calculates height of a triangle spanned by 2 vectors

    @param project_from: vector which tip points to a vertex,
    from which the height is dropped
    @param project_onto: vector which contains the side of the triangle,
    onto which the height id dropped
    """
    alfa = vector_angle(project_onto, project_from)
    return math.sin(alfa) * project_from.length


def cot(angle):
    return 1.0 / math.tan(angle)


def same_direction_vec(v1: Vector3, v2: Vector3):
    return normalize(v1) == normalize(v2)


def opposite_direction_vec(v1: Vector3, v2: Vector3):
    return normalize(v1) == -normalize(v2)
