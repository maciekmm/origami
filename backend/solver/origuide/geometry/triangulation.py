from typing import List

from shapely.geometry import MultiPoint, Polygon, Point
from shapely.ops import triangulate as sh_triangulate

from origuide.geometry.geometry_models import Vertex


def triangulate(face: List[Vertex]):
    if len(face) == 3:
        return [face]

    face_coords = list(map(lambda v: v.pos.vec.copy(), face))

    x_coords = list(map(lambda c: c[0], face_coords))
    y_coords = list(map(lambda c: c[1], face_coords))

    if all_equal(x_coords, x_coords[0]):
        faces_2d = splice_column_in_matrix(face_coords, 0)
    elif all_equal(y_coords, y_coords[0]):
        faces_2d = splice_column_in_matrix(face_coords, 1)
    else:
        faces_2d = splice_column_in_matrix(face_coords, 2)

    points_list = list(map(lambda p: (float(p[0]), float(p[1])), faces_2d))
    sh_points = MultiPoint(points_list)
    original_polygon = Polygon(sh_points)

    pos_to_idx = {pos: idx for pos, idx in zip(points_list, range(len(face)))}
    triangles = sh_triangulate(sh_points)

    res = []
    for triangle in triangles:
        triangle_points = list(zip(*triangle.exterior.coords.xy))
        triangle_points.pop()  # last point is repeated in shapely
        if is_triangle_within_original_hull(triangle_points, original_polygon):
            res.append([face[pos_to_idx[pos]] for pos in triangle_points])

    return res


def all_equal(arr, val):
    return all(map(lambda x: x == val, arr))


def splice_column_in_matrix(matrix, col):
    for row in matrix:
        row.pop(col)
    return matrix


def is_triangle_within_original_hull(triangle, original_polygon):
    for (v1, v2) in zip(triangle, triangle[1:] + [triangle[0]]):
        if not point_intersects_with_epsilon((v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, original_polygon):
            return False
    return True


def point_intersects_with_epsilon(x, y, polygon, eps=0.01):
    pos_modifiers = [
        (0, 0),
        (eps, 0),
        (0, eps),
        (eps, eps),
        (-eps, 0),
        (0, -eps),
        (-eps, -eps),
        (-eps, eps),
        (eps, -eps)
    ]

    for pm in pos_modifiers:
        if (Point(x + pm[0], y + pm[1])).intersects(polygon):
            return True
    return False
