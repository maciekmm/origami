from typing import List, Optional

from origuide.forces.beam_force import set_all_beam_forces
from origuide.config import CONFIG
from origuide.forces.crease_force import set_all_crease_forces
from origuide.forces.damping_force import set_all_damping_forces
from origuide.forces.face_force import set_all_face_forces
from origuide.geometry.generic_models import Vector3
from origuide.geometry.geometry_models import Vertex, Edge, Face, angle_from_assignment

import math
import numpy as np


class Solver:
    def __init__(self, vertices: List[Vertex], edges: List[Edge], faces: List[Face],
                 edges_fold_angles: List[Optional[float]]):
        self.vertices = vertices
        self.edges = edges
        self.faces = faces
        self.edges_fold_angles = edges_fold_angles

        # TODO: Getting k_axial, getting min node mass
        max_k_axial = max(map(lambda e: e.k_axial, self.edges))
        self.d_t = 1 / (2 * math.pi * math.sqrt(
            max_k_axial / self.vertices[0].mass)) * 1.0  # TODO: Fine tune this parameter
        self.epsilon = CONFIG['SOLVER_EPSILON']

    def solve(self, output):
        self._reset_forces()
        self._reset_velocities()
        self._set_forces()
        self._set_target_angles()
        cur_forces = self._total_forces_vecs()

        if CONFIG['DEBUG']:
            print('Starting solver')
            print('FORCES: ', cur_forces)

        plot_idx = 0
        finished = False
        while not finished:
            if CONFIG['DEBUG']:
                print(cur_forces)

            for i, (v, total_force) in enumerate(zip(self.vertices, cur_forces)):
                node_mass = v.mass
                v_t = v.velocity
                p_t = v.pos

                a = Vector3.from_vec(total_force) / node_mass

                v_next = v_t + a * self.d_t
                v.pos = p_t + v_next * self.d_t

                v.velocity = v_next

                if CONFIG['DEBUG']:
                    print(v)
                    print('VELOCITY: ', v.velocity)
                    print('TOTAL FORCE: ', v.total_force())
                    print('a = ', a)
                    print()

            if CONFIG['DEBUG_PLOT']:
                if plot_idx >= CONFIG['DEBUG_PLOT_FROM'] and plot_idx % CONFIG['DEBUG_PLOT_EVERY'] == 0:
                    from origuide.tools import plot
                    plot.plot3d(self.vertices, self.edges, self.faces, cur_forces)
            plot_idx += 1

            if CONFIG['DEBUG']:
                print('---')

            self._reset_forces()
            self._set_forces()

            prev_forces = cur_forces.copy()
            cur_forces = self._total_forces_vecs()

            finished = self._should_end(prev_forces, cur_forces)
            output.accept(self.vertices, finished)
        return

    def _reset_forces(self):
        for v in self.vertices:
            v.reset_forces()

    def _reset_velocities(self):
        for v in self.vertices:
            v.reset_velocity()

    def _set_forces(self):
        # TODO: For potential speedup - beam and damping can be calculated in one place
        set_all_beam_forces(self.edges)
        set_all_damping_forces(self.edges)
        set_all_crease_forces(self.edges)
        set_all_face_forces(self.faces)

    def _set_target_angles(self):
        if self.edges_fold_angles is None:
            for e in self.edges:
                e.target_angle = angle_from_assignment(e.assignment)
        else:
            for (e, fold_angle) in zip(self.edges, self.edges_fold_angles):
                if fold_angle is None:
                    e.target_angle = angle_from_assignment(e.assignment)
                else:
                    e.target_angle = fold_angle

    def _total_forces_vecs(self):
        return list(map(lambda v: v.total_force().vec, self.vertices))

    def _should_end(self, prev_forces, cur_forces):
        diff = np.abs(np.array(cur_forces) - np.array(prev_forces))
        return np.all(diff <= self.epsilon)
