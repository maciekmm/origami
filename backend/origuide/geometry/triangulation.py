from typing import List

from scipy.spatial import Delaunay  # TODO: Fix this not being picked up by IDEs
import numpy as np

# TriangulationRes = namedtuple("TriangulationRes", "faces vertices edges")
from geometry.geometry_models import Vertex


def triangulate(face: List[Vertex]):
    """
    @param face: np.array of Vertex instances
    """
    # TODO: Figure out better algorithm than this (e.g. rotate the plane)
    # This breaks when surface projection onto xy plane is a line
    if len(face) == 3:
        return [face]
        # return TriangulationRes([face], [], [])

    face_coords = np.array(list(map(lambda v: v.pos.pos, face)))

    # z_coords = face_coords[:, 2]
    faces_2d = face_coords[:, 0:2]

    tri = Delaunay(faces_2d, qhull_options='QJ')

    res = []
    for triangle in tri.simplices:
        res.append(list(map(lambda cord: face[cord], triangle)))

    return np.array(res)

    # triangle_coords = faces_2d[tri.simplices]

    # print(triangle_coords)

    # f = lambda cord: z_coords[cord]
    # append_cords = f(tri.simplices)
    #
    # result = []
    # for i, triangle in enumerate(triangle_coords):
    #     result.append(np.stack([triangle[:, 0], triangle[:, 1], append_cords[i]], axis=-1))
    #
    # return np.array(result)
    #
