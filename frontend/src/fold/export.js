import { getComputedProperty } from "@fold/properties"

function interpolateFrameValues(frames, frameId) {
	const interpolated = {}
	const frame = frames[frameId]
	for (let property in frame) {
		// An Origuide exclusive temporary property we are going to discard
		if (property === "frame_inheritDeep") continue
		interpolated[property] = getComputedProperty(frames, frameId, property)
	}
	return interpolated
}

export default function interpolateModel(model) {
	return {
		...model,
		file_frames: model.file_frames.map((frame, id) =>
			interpolateFrameValues(model.file_frames, id)
		),
	}
}
