export const FRAME_RATE_PROPERTY = "file_og:frameRate"

export function getComputedProperty(frames, frameId, property) {
	if (typeof frameId !== "number") {
		return undefined
	}

	const frame = frames[frameId]
	if (!frame) {
		return undefined
	}

	if (property in frame) {
		return frame[property]
	}

	if (!!frame["frame_inherit"]) {
		return getComputedProperty(frames, frame["frame_parent"], property)
	}

	return undefined
}
