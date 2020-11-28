export const FRAME_RATE_PROPERTY = "file_og:frameRate"
const INHERIT_DEEP_PROPERTY = "frame_og:inheritDeep"

export function getComputedProperty(frames, frameId, property) {
	if (typeof frameId !== "number") {
		return undefined
	}

	const frame = frames[frameId]
	if (!frame) {
		return undefined
	}

	const value = frame[property]

	const inherit =
		!!frame["frame_inherit"] && typeof frame["frame_parent"] === "number"
	if (!inherit) {
		return value
	}

	const isPropertyDefined = property in frame

	// no property whatsoever
	if (!isPropertyDefined) {
		return getComputedProperty(frames, frame["frame_parent"], property)
	}

	const deepInherit = !!frame[INHERIT_DEEP_PROPERTY] && Array.isArray(value)
	if (!deepInherit) {
		return value
	}

	// property is an array
	const containsNulls = value.includes(null)
	if (!containsNulls) {
		return value
	}

	const inherited = getComputedProperty(frames, frame["frame_parent"], property)
	if (!inherited) {
		return value
	}

	return value.map((value, i) => {
		if (value !== null) return value
		return inherited[i]
	})
}
