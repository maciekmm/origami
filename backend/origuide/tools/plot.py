from typing import List

import matplotlib.pyplot as plt
import numpy as np
from matplotlib import collections as mc

from geometry.geometry_models import Vertex, Edge
from mpl_toolkits.mplot3d.art3d import Line3DCollection

def assignment_to_color(assignment):
    if assignment == 'M':
        return 'red'
    elif assignment == 'V':
        return 'blue'
    elif assignment == 'F':
        return 'yellow'
    else:
        return 'gray'

def plot3d(vertices: List[Vertex], edges: List[Edge], forces):
    fig = plt.figure(1)
    ax = fig.add_subplot(111, projection='3d')

    lines = np.array(list(map(lambda e: np.array([tuple(e.v1.pos.vec), tuple(e.v2.pos.vec)]), edges)))
    colors = list(map(lambda e: assignment_to_color(e.assignment), edges))
    lc = Line3DCollection(lines, colors=colors, linewidths=2)

    xs, ys, zs = [], [], []
    for v in vertices + [vertices[0]]:
        xs.append(v.x)
        ys.append(v.y)
        zs.append(v.z)

    display_forces = np.concatenate((forces, [forces[0, :]]))

    us, vs, ws = zip(*display_forces)
    # ax.add_collection3d(lc, zs=lines[:, :, 2:])
    ax.add_collection(lc)
    # ax.plot(xs, ys, zs, color='red')
    ax.scatter(xs, ys, zs)
    ax.quiver(xs, ys, zs, us, vs, ws)

    box_lim = 4

    ax.set_xlim([-box_lim, box_lim])
    ax.set_ylim([-box_lim, box_lim])
    ax.set_zlim([-box_lim, box_lim])

    plt.show()
    print("")


