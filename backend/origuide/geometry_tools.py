import numpy as np

from models import Vector3


def vector_from_to(v1: Vector3, v2: Vector3) -> Vector3:
    return Vector3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z)


def normalize(v: Vector3) -> Vector3:
    res = Vector3(v.x, v.y, v.z)
    res.vec = res.vec / np.linalg.norm(res.vec)

    return res
