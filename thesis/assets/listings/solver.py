for step in Instruction.steps:
    solve(step.vertices, step.target_angles)

def solve(vertices, target_angles):
    set_target_angles(target_angles)

    while not finished:
        cur_forces = set_forces()

        for (v, total_force) in zip(vertices, cur_forces):
            v_t, p_t = v.velocity, v.pos
            a = total_force / v.mass
            v_next = v_t + a * d_t
            v.pos = p_t + v_next * d_t
            v.velocity = v_next
