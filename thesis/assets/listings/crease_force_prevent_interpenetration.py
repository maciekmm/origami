diff = theta - edge.last_theta
if diff < -ANGLE_FLIP_THRESHOLD:
    diff += TWO_PI
elif diff > ANGLE_FLIP_THRESHOLD:
    diff -= TWO_PI
theta = edge.last_theta + diff
