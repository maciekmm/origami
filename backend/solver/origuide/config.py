import math
import os

# TODO: Probably split into something like program-config, and simulation parameters

CONFIG = {
    'DEBUG': False,
    'DEBUG_PLOT': False,
    'DEBUG_FORCES': False,
    'DEBUG_PLOT_FORCES': False,
    'DEBUG_PLOT_NORMALS': False,
    'DEBUG_PLOT_VELOCITIES': False,
    'DEBUG_PLOT_EVERY': 50,
    'DEBUG_PLOT_FROM': 0,
    'PROFILE': False,

    'NORMALIZE': True,
    'BOUNDING_BOX_DIAG_LEN': math.sqrt(3) * 2,

    'AXIAL_STIFFNESS_EA': 20.0,
    'FACET_STIFFNESS': 20.0,
    'FOLD_STIFFNESS': 0.7,
    'FACE_STIFFNESS': 0.2,
    'SOLVER_EPSILON': 1.0e-6,
    'DAMPING_PERCENT': 0.3,
}

ENV_PREFIX = 'ORIGUIDE'


for k in CONFIG.keys():
    val = os.getenv(f'{ENV_PREFIX}_{k}')
    if val is not None:
        val = type(CONFIG[k])(val)
        print(f'Setting: {k}={val}')
        CONFIG[k] = val
