from typing import List

import matplotlib.pyplot as plt
import numpy as np
from matplotlib import collections as mc
from mpl_toolkits.mplot3d.art3d import Line3DCollection

from config import CONFIG

from geometry.geometry_models import Vertex, Edge, Face
from geometry.generic_models import Vector3

def assignment_to_color(assignment):
    if assignment == 'M':
        return 'red'
    elif assignment == 'V':
        return 'blue'
    elif assignment == 'F':
        return 'yellow'
    else:
        return 'gray'

def plot3d(vertices: List[Vertex], edges: List[Edge], faces: List[Face], forces):
    forces = np.array(forces)
    fig = plt.figure(1)
    ax = fig.add_subplot(111, projection='3d')

    lines = np.array(list(map(lambda e: np.array([tuple(e.v1.pos.vec), tuple(e.v2.pos.vec)]), edges)))
    colors = list(map(lambda e: assignment_to_color(e.assignment), edges))
    lc = Line3DCollection(lines, colors=colors, linewidths=2)

    xs, ys, zs = [], [], []
    vel_xs, vel_ys, vel_zs = [], [], []
    for v in vertices + [vertices[0]]:
        xs.append(v.x)
        ys.append(v.y)
        zs.append(v.z)

        vel_xs.append(v.velocity[0])
        vel_ys.append(v.velocity[1])
        vel_zs.append(v.velocity[2])

    display_forces = np.concatenate((forces, [forces[0, :]]))

    us, vs, ws = zip(*display_forces)

    xns, yns, zns, uns, vns, wns = [], [], [], [], [], []
    for face in faces:
        n = face.normal
        v1 = face.vertices[0]
        v2 = face.vertices[1]
        v3 = face.vertices[2]

        mid_vec = Vector3((v1.x + v2.x + v3.x) / 3,
                          (v1.y + v2.y + v3.y) / 3,
                          (v1.z + v2.z + v3.z) / 3)
        trans_vec = mid_vec - v1.pos
        start_point = v1.pos + trans_vec

        xns.append(start_point.x)
        yns.append(start_point.y)
        zns.append(start_point.z)
        uns.append(n.x)
        vns.append(n.y)
        wns.append(n.z)

    # ax.add_collection3d(lc, zs=lines[:, :, 2:])
    ax.add_collection(lc)
    # ax.plot(xs, ys, zs, color='red')
    ax.scatter(xs, ys, zs)

    # Plot forces
    if CONFIG['DEBUG_PLOT_FORCES']:
        ax.quiver(xs, ys, zs, us, vs, ws)

    # Plot faces' normals
    if CONFIG['DEBUG_PLOT_NORMALS']:
        ax.quiver(xns, yns, zns, uns, vns, wns, color='g')

    # Plot velocities
    if CONFIG['DEBUG_PLOT_VELOCITIES']:
        ax.quiver(xs, ys, zs, vel_xs, vel_ys, vel_zs, color='r')

    box_lim = 2

    ax.set_xlim([-box_lim, box_lim])
    ax.set_ylim([-box_lim, box_lim])
    ax.set_zlim([-box_lim / 2, box_lim / 2])

    # Camera settings
    ax.elev = 20
    ax.azim = 120

    plt.show()
