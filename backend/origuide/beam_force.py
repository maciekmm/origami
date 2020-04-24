from config import CONFIG
from generic_models import ForceName
from geometry_models import Edge
from geometry_tools import vector_from_to, normalize


def _set_beam_force(edge: Edge):
    f1 = vector_from_to(edge.v1, edge.v2)
    f2 = vector_from_to(edge.v2, edge.v1)

    i12 = normalize(f1)

    c = CONFIG['AXIAL_STIFFNESS_EA']

    m = c * (edge.length() - edge.l0) / edge.l0

    f1.vec = m * i12.vec
    f2.vec = -m * i12.vec

    edge.v1.set_force(ForceName.BEAM, f1)
    edge.v2.set_force(ForceName.BEAM, f2)


def set_all_beam_forces(edges):
    for e in edges:
        _set_beam_force(e)
