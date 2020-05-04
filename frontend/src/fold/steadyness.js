export const STEADY_STATE_CLASS = "origuide:steady_state"

export function isSteady(frame) {
	return (
		!!frame.frame_classes &&
		frame.frame_classes.indexOf(STEADY_STATE_CLASS) != -1
	)
}

export function getSteadyFrameIds(frames) {
	return frames
		.map((_, idx) => idx)
		.filter((frame_idx) => isSteady(frames[frame_idx]))
}

export function markFrameSteady(frame) {
	if (!frame.frame_classes) {
		frame.frame_classes = [STEADY_STATE_CLASS]
	} else if (frame.frame_classes.indexOf(STEADY_STATE_CLASS) == -1) {
		frame.frame_classes = [...frame.frame_classes, STEADY_STATE_CLASS]
	}
}
