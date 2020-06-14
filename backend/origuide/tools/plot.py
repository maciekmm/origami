from typing import List

import matplotlib.pyplot as plt

from geometry.geometry_models import Vertex


def plot3d(vertices: List[Vertex], forces):
    fig = plt.figure(1)
    ax = fig.add_subplot(111, projection='3d')

    xs, ys, zs = [], [], []
    for v in vertices:
        xs.append(v.x)
        ys.append(v.y)
        zs.append(v.z)

    us, vs, ws = zip(*forces)
    ax.plot(xs, ys, zs, color='red')
    ax.scatter(xs, ys, zs)
    ax.quiver(xs, ys, zs, us, vs, ws)

    box_lim = 4

    ax.set_xlim([-box_lim, box_lim])
    ax.set_ylim([-box_lim, box_lim])
    ax.set_zlim([-box_lim, box_lim])

    plt.show()


