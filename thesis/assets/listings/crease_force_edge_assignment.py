if edge.assignment == EDGE_BOUNDARY:
   k_crease = 0 

if edge.assignment == EDGE_MOUNTAIN or edge.assignment == EDGE_VALLEY:
    k_crease = edge.l0 * CONFIG['FOLD_STIFFNESS']
elif edge.assignment == EDGE_FLAT or edge.assignment == EDGE_UNKNOWN:
    k_crease = edge.l0 * CONFIG['FACET_STIFFNESS']
else:
    raise RuntimeError("wrong face assignment: ", edge.assignment)
