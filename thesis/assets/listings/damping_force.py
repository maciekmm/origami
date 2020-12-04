delta_v = edge.v2.velocity - edge.v1.velocity
damping_force = edge.damping_coeff * delta_v
edge.v1.set_force(ForceName.DAMPING, damping_force)
edge.v2.set_force(ForceName.DAMPING, -damping_force)
