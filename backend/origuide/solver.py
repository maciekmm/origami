from typing import List

import numpy as np

from tools import plot
from forces.beam_force import set_all_beam_forces
from config import CONFIG
from forces.crease_force import set_all_crease_forces
from forces.damping_force import set_all_damping_forces
from forces.face_force import set_all_face_forces
from geometry.generic_models import Vector3
from geometry.geometry_models import Vertex, Edge, Face
import copy


class Solver:
    def __init__(self, vertices: List[Vertex], edges: List[Edge], faces: List[Face]):
        self.vertices = vertices
        self.edges = edges
        self.faces = faces

        # TODO: Maybe add error indicator (like globalError in original simulator) to see how it does

        # TODO: Is this needed here if we have it in vertices? (or vice versa)
        self.vertices_velocity = np.zeros((len(vertices), 3))

        # TODO: Getting k_axial, getting min node mass
        max_k_axial = max(map(lambda e: e.k_axial, self.edges))
        self.d_t = 1 / (2 * np.pi * np.sqrt(max_k_axial / self.vertices[0].mass)) * 1.0 # TODO: Fine tune this parameter
        self.epsilon = CONFIG['SOLVER_EPSILON']

    def solve(self, output):
        self._reset_forces()
        self._set_forces()
        prev_forces = None
        cur_forces = self._total_forces_vecs()

        if CONFIG['DEBUG']:
            print('Starting solver')
            print('FORCES: ', cur_forces)
            print('VELOCITIES: ', self.vertices_velocity)

        plot_idx = 0
        while self._should_continue(prev_forces, cur_forces):
            for i, (v, v_t, total_force) in enumerate(zip(self.vertices, self.vertices_velocity, cur_forces)):
                v.velocity = Vector3.from_vec(v_t)
                node_mass = v.mass
                p_t = v.pos

                a = total_force / node_mass
                v_next = v_t + a * self.d_t
                self.vertices_velocity[i] = v_next

                v.pos = p_t + Vector3.from_vec(v_next * self.d_t)

                if CONFIG['DEBUG']:
                    print(v)

            self._reset_forces()
            self._set_forces()

            prev_forces = cur_forces.copy()
            cur_forces = self._total_forces_vecs()

            if CONFIG['DEBUG']:
                print(cur_forces)
            output.accept(copy.deepcopy(self.vertices))

            if CONFIG['DEBUG_PLOT']:
                if plot_idx % CONFIG['DEBUG_PLOT_ITER'] == 0:
                    plot.plot3d(self.vertices, self.edges, self.faces, cur_forces)
                plot_idx += 1

            if CONFIG['DEBUG']:
                print()

        print('FINISHED')
        for v in self.vertices:
            print(v)
        return

    def _reset_forces(self):
        for v in self.vertices:
            v.reset_forces()

    def _set_forces(self):
        set_all_beam_forces(self.edges)
        set_all_damping_forces(self.edges)
        set_all_crease_forces(self.edges)
        set_all_face_forces(self.faces)

    def _total_forces_vecs(self):
        return np.array(list(map(lambda v: v.total_force().vec, self.vertices)))

    def _should_continue(self, prev_forces, cur_forces):
        # TODO: Add iteration count also as a stop condition?
        if prev_forces is None:
            return True

        diff = np.abs(cur_forces - prev_forces)
        return np.any(diff > self.epsilon)
