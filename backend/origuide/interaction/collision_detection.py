from typing import List, Any

from config import CONFIG
from geometry.generic_tools import vector_from_to, cross, dot
from geometry.geometry_models import Face


def collide(face1: Face, face2: Face) -> bool:
    """
    http://web.stanford.edu/class/cs277/resources/papers/Moller1997b.pdf
    Some optimizations are possible. For that see the above paper and
    https://github.com/erich666/jgt-code/blob/master/Volume_08/Number_1/Shen2003/tri_tri_test/include/Moller97.c
    """

    print('---')
    print('Checking faces')
    print('face1: ', face1)
    print('face2: ', face2)

    [v0, v1, v2] = face1.vertices
    [u0, u1, u2] = face2.vertices
    v0, v1, v2 = v0.pos, v1.pos, v2.pos
    u0, u1, u2 = u0.pos, u1.pos, u2.pos

    # plane equation: n1.x+d1=0
    e1 = vector_from_to(v0, v1)
    e2 = vector_from_to(v0, v2)
    n1 = cross(e1, e2)
    d1 = -dot(n1, v0)

    du0 = dot(n1, u0) + d1
    du1 = dot(n1, u1) + d1
    du2 = dot(n1, u2) + d1

    if CONFIG['COLLISION_USE_EPSILON']:
        eps = CONFIG['COLLISION_EPSILON']
        if abs(du0) < eps:
            du0 = 0.0
        if abs(du1) < eps:
            du1 = 0.0
        if abs(du2) < eps:
            du2 = 0.0

    du0du1 = du0 * du1
    du0du2 = du0 * du2

    # Same sign, all != 0 => no intersection
    if du0du1 > 0 and du0du2 > 0:
        return False

    e1 = vector_from_to(u0, u1)
    e2 = vector_from_to(u0, u2)
    n2 = cross(e1, e2)
    d2 = -dot(n2, u0)

    dv0 = dot(n2, v0) + d2
    dv1 = dot(n2, v1) + d2
    dv2 = dot(n2, v2) + d2

    if CONFIG['COLLISION_USE_EPSILON']:
        eps = CONFIG['COLLISION_EPSILON']
        if abs(dv0) < eps:
            dv0 = 0.0
        if abs(dv1) < eps:
            dv1 = 0.0
        if abs(dv2) < eps:
            dv2 = 0.0

    dv0dv1 = dv0 * dv1
    dv0dv2 = dv0 * dv2

    # Same sign, all != 0 => no intersection
    if dv0dv1 > 0 and dv0dv2 > 0:
        return False

    d = cross(n1, n2)
    _max = abs(d.x)
    idx = 0
    b = abs(d.y)
    c = abs(d.z)
    if b > _max:
        _max = b
        idx = 1
    if c > _max:
        _max = c
        idx = 2

    # Simplified projection
    vp0 = v0[idx]
    vp1 = v1[idx]
    vp2 = v2[idx]

    up0 = u0[idx]
    up1 = u1[idx]
    up2 = u2[idx]

    # Compute overlapping (or not) interval
    [isect1_0, isect1_1], is_coplanar = compute_intervals(vp0, vp1, vp2, dv0, dv1, dv2, dv0dv1, dv0dv2)
    [isect2_0, isect2_1], is_coplanar = compute_intervals(up0, up1, up2, du0, du1, du2, du0du1, du0du2)

    # Special case check for coplanar triangles
    if is_coplanar:
        print('It is coplanar?')
        return coplanar_intersect()

    if isect1_0 > isect1_1:
        isect1_0, isect1_1 = isect1_1, isect1_0
    if isect2_0 > isect2_1:
        isect2_0, isect2_1 = isect2_1, isect2_0

    # Check if interval does not overlap
    if isect1_1 <= isect2_0 or isect2_1 <= isect1_0:
        return False

    print('NORMAL RET ')
    print('isect1:', isect1_0, isect1_1)
    print('isect2:', isect2_0, isect2_1)
    return True


def compute_intervals(vv0, vv1, vv2, d0, d1, d2, d0d1, d0d2) -> (List[float], Any):
    if d0d1 > 0:
        return isect(vv2, vv0, vv1, d2, d0, d1), False
    elif d0d2 > 0:
        return isect(vv1, vv0, vv2, d1, d0, d2), False
    elif d1 * d2 > 0 and d0 != 0:
        return isect(vv0, vv1, vv2, d0, d1, d2), False
    elif d1 != 0:
        return isect(vv1, vv0, vv2, d1, d0, d2), False
    elif d2 != 0:
        return isect(vv2, vv0, vv1, d2, d0, d1), False
    else:
        # TODO: Not bothered with this for now, since it's a very edgy edge case (unless the paper is flat)
        return [0, 0], True


def isect(vv0, vv1, vv2, d0, d1, d2) -> List[float]:
    return [
        vv0 + (vv1 - vv0) * d0 / (d0 - d1),
        vv0 + (vv2 - vv0) * d0 / (d0 - d2),
    ]


def coplanar_intersect():
    return False # TODO: Possibly make this work
