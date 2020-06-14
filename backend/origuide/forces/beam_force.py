from config import CONFIG
from geometry.generic_models import Vector3
from geometry.geometry_models import Edge, ForceName
from geometry.generic_tools import vector_from_to, normalize


def _set_beam_force(edge: Edge):
    i12 = normalize(vector_from_to(edge.v1.pos, edge.v2.pos))

    k_axial = CONFIG['AXIAL_STIFFNESS_EA'] / edge.l0

    m = k_axial * (edge.length - edge.l0)

    f1 = Vector3.from_vec(m * i12.vec)

    edge.v1.set_force(ForceName.BEAM, f1)
    edge.v2.set_force(ForceName.BEAM, -f1)


def set_all_beam_forces(edges):
    for e in edges:
        _set_beam_force(e)
