i12 = normalize(vector_from_to(edge.v1.pos, edge.v2.pos))
k_axial = CONFIG['AXIAL_STIFFNESS_EA'] / edge.l0
m = k_axial * (edge.length - edge.l0)
f1 = m * i12
edge.v1.set_force(ForceName.BEAM, f1)
edge.v2.set_force(ForceName.BEAM, -f1)
