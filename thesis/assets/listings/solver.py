for step in Instruction.steps:
    solve(step.vertices, step.target_angles)


def solve(vertices, target_angles):
    cur_forces = set_forces()
    set_target_angles(target_angles)

    while not finished:
        for (v, total_force) in zip(vertices, cur_forces):
            node_mass = v.mass
            v_t = v.velocity
            p_t = v.pos
            a = total_force / node_mass
            v_next = v_t + a * d_t
            v.pos = p_t + v_next * d_t
            v.velocity = v_next

        prev_forces = cur_forces.copy()
        cur_forces = set_forces()

