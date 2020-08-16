export const FRAME_RATE_PROPERTY = "file_og:frameRate"

export function getComputedProperty(frames, frameId, property) {
	if (typeof frameId !== "number") {
		return undefined
	}

	const frame = frames[frameId]
	if (property in frame) {
		return frame[property]
	}

	if (!!frame["frame_inherit"]) {
		return getComputedProperty(frames, frame["frame_parent"], property)
	}

	return undefined
}

export function findEdgeIdFromVertexIndices(frames, v1, v2) {
	const edges = frames[0].edges_vertices
	return edges.findIndex(
		([eV1, eV2]) => (eV1 == v1 && eV2 == v2) || (eV1 == v2 && eV2 == v1)
	)
}
