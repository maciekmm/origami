from typing import List

from scipy.spatial import Delaunay
import numpy as np

from geometry.geometry_models import Vertex


# TODO: Get rid of numpy

def triangulate(face: List[Vertex]):
    if len(face) == 3:
        return [face]

    face_coords = np.array(list(map(lambda v: v.pos.vec, face)))

    x_coords = np.array(list(map(lambda c: c[0], face_coords)))
    y_coords = np.array(list(map(lambda c: c[1], face_coords)))

    if (x_coords == x_coords[0]).all():
        faces_2d = np.delete(face_coords, 0, 1)
    elif (y_coords == y_coords[0]).all():
        faces_2d = np.delete(face_coords, 1, 1)
    else:
        faces_2d = np.delete(face_coords, 2, 1)

    tri = Delaunay(faces_2d, qhull_options='QJ')

    res = [list(map(lambda cord: face[cord], triangle))
           for triangle in tri.simplices]

    return np.array(res)
