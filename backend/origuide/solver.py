from typing import List

import numpy as np

import plot
from beam_force import set_all_beam_forces
from config import CONFIG
from crease_force import set_all_crease_forces
from face_force import set_all_face_forces
from generic_models import Vector3
from geometry_models import Vertex, Edge, Face


class Solver:
    # TODO: NUMERICAL DAMPING
    def __init__(self, vertices: List[Vertex], edges: List[Edge], faces: List[Face]):
        self.vertices = vertices
        self.edges = edges
        self.faces = faces

        # TODO: Add damping force and see if it makes the simulation numerically stable
        self.vertices_velocity = np.zeros((len(vertices), 3))

        # TODO: Getting k_axial, getting min node mass
        max_k_axial = max(map(lambda e: e.k_axial, self.edges))
        self.d_t = 1 / (2 * np.pi * np.sqrt(max_k_axial / self.vertices[0].mass))  # TODO: Fine tune this parameter
        self.epsilon = CONFIG['SOLVER_EPSILON']

    def solve(self):
        self._set_forces()
        prev_forces = None
        cur_forces = self._total_forces_vecs()

        while self._should_continue(prev_forces, cur_forces):
            for i, (v, v_t, total_force) in enumerate(zip(self.vertices, self.vertices_velocity, cur_forces)):
                node_mass = v.mass
                p_t = v.vec

                a = total_force / node_mass
                v_next = v_t + a * self.d_t
                self.vertices_velocity[i] = v_next

                v.vec = p_t + Vector3.from_vec(v_next * self.d_t)

                print(v)

            self._reset_forces()
            self._set_forces()

            prev_forces = cur_forces.copy()
            cur_forces = self._total_forces_vecs()

            print(cur_forces)
            # plot.plot3d(self.vertices, cur_forces)

            print()

        print('FINISHED')
        for v in self.vertices:
            print(v)

    def _reset_forces(self):
        for v in self.vertices:
            v.reset_forces()

    def _set_forces(self):
        set_all_beam_forces(self.edges)
        # set_all_crease_forces(self.edges)
        # set_all_face_forces(self.faces)

    def _total_forces_vecs(self):
        return np.array(list(map(lambda v: v.total_force().vec, self.vertices)))

    def _should_continue(self, prev_forces, cur_forces):
        if prev_forces is None:
            return True

        diff = np.abs(cur_forces - prev_forces)
        return np.any(diff > self.epsilon)
