from typing import List

import matplotlib.pyplot as plt

from geometry_models import Vertex


def plot3d(vertices: List[Vertex], forces):
    fig = plt.figure(1)
    ax = fig.add_subplot(111, projection='3d')

    xs, ys, zs = [], [], []
    for v in vertices:
        xs.append(v.x)
        ys.append(v.y)
        zs.append(v.z)

    us, vs, ws = zip(*forces)
    ax.scatter(xs, ys, zs)
    ax.quiver(xs, ys, zs, us, vs, ws)
    ax.set_xlim([-4, 4])
    ax.set_ylim([-4, 4])
    ax.set_zlim([-4, 4])

    plt.show()


