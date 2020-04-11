export const STEADY_STATE = "origuide:steady_state"

export function isSteady(frame) {
    return !!frame.frame_classes && frame.frame_classes.indexOf(STEADY_STATE) != -1
}

export function getSteadyFrameIds(frames) {
    return frames
    .map(
        (_, idx) => idx
    )
    .filter(
        frame_idx => isSteady(frames[frame_idx]) 
    );
}