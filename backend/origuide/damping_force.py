from typing import List

from generic_models import ForceName
from geometry_models import Edge


def _set_damping_force(edge: Edge):
    # v2 is the 'neighbour'
    delta_v = edge.v2.velocity - edge.v1.velocity
    damping_force = edge.damping_coeff * delta_v

    edge.v1.set_force(ForceName.DAMPING, damping_force)
    edge.v2.set_force(ForceName.DAMPING, -damping_force)


def set_all_damping_forces(edges: List[Edge]):
    for edge in edges:
        _set_damping_force(edge)
