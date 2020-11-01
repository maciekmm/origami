import { markFrameSteady } from "./steadyness"
import { FRAME_RATE_PROPERTY } from "./properties"

export const DEFAULT_FRAME_RATE = 24
export const DEFAULT_CREATOR = "Origuide - https://origami.wtf"
export const DEFAULT_BOUNDING_BOX_DIAGONAL = 2 * Math.sqrt(3)

export default function preprocessFOLDModel(foldModel) {
	moveRootFrameToFileFrames(foldModel)

	markFrameSteady(foldModel.file_frames[0])
	markFrameSteady(foldModel.file_frames[foldModel.file_frames.length - 1])

	setDefaultFrameRate(foldModel)
	setDefaultCreator(foldModel)

	normalizeCoordinates(foldModel)

	return foldModel
}

export function markFramesToInheritDeeply(foldModel) {
	for (let frame of foldModel.file_frames) {
		frame["frame_og:inheritDeep"] = true
	}
}

export function setDefaultCreator(foldModel) {
	foldModel["file_creator"] = DEFAULT_CREATOR
}

export function setDefaultFrameRate(foldModel) {
	foldModel[FRAME_RATE_PROPERTY] =
		foldModel[FRAME_RATE_PROPERTY] || DEFAULT_FRAME_RATE
}

export function moveRootFrameToFileFrames(foldModel) {
	let firstFrame = {}
	for (let property in foldModel) {
		const value = foldModel[property]

		if (!property.startsWith("file_")) {
			firstFrame[property] = value
			delete foldModel[property]
		}
	}

	if (Object.keys(firstFrame).length == 0) {
		return
	}

	if (!foldModel.file_frames) {
		foldModel.file_frames = []
	}
	foldModel.file_frames = [firstFrame, ...foldModel.file_frames]
}

export function normalizeCoordinates(foldModel) {
	const firstFrame = foldModel.file_frames[0]
	const firstFrameVertices = firstFrame["vertices_coords"]

	const firstFrameBoundingBox = computeBoundingBox(firstFrameVertices)
	const firstFrameCenteredVertices = centerVertices(
		firstFrameBoundingBox,
		firstFrameVertices
	)
	const furthestDistanceFromOrigin = getFurthestDistanceFromOrigin(
		firstFrameCenteredVertices
	)

	const normalizeFrame = (frame) => {
		const vertices = frame["vertices_coords"]
		if (!vertices || vertices.length === 0) {
			return frame
		}

		const centeredCoords = centerVertices(firstFrameBoundingBox, vertices)
		const normalized = normalizeBoundingBox(
			centeredCoords,
			DEFAULT_BOUNDING_BOX_DIAGONAL,
			furthestDistanceFromOrigin
		)
		return {
			...frame,
			vertices_coords: normalized,
		}
	}
	foldModel.file_frames = foldModel.file_frames.map(normalizeFrame)
}

function vectorLengthSquared(coordinates) {
	const [x, y, maybeZ] = coordinates
	const z = maybeZ || 0
	return x * x + y * y + z * z
}

function getFurthestDistanceFromOrigin(vertices) {
	if (!vertices || vertices.length === 0) {
		return 0
	}

	const furthestPointFromOrigin = vertices.reduce((furthestYet, candidate) => {
		if (
			!furthestYet ||
			vectorLengthSquared(candidate) > vectorLengthSquared(furthestYet)
		) {
			return candidate
		}
		return furthestYet
	})

	const furthestDistance = Math.sqrt(
		vectorLengthSquared(furthestPointFromOrigin)
	)
	return furthestDistance
}

function normalizeBoundingBox(
	vertices,
	boxDiagLen,
	furthestDistanceFromOrigin
) {
	if (
		!vertices ||
		vertices.length === 0 ||
		boxDiagLen === 0 ||
		furthestDistanceFromOrigin === 0
	) {
		return vertices
	}

	const scaleFactor = furthestDistanceFromOrigin / (boxDiagLen / 2.0)

	const scaleVertex = ([x, y, maybeZ]) => {
		return [x / scaleFactor, y / scaleFactor, (maybeZ || 0) / scaleFactor]
	}

	return vertices.map(scaleVertex)
}

function computeBoundingBox(vertices) {
	if (!vertices || vertices.length === 0) {
		return [
			[0, 0, 0],
			[0, 0, 0],
		]
	}

	return vertices.reduce(
		([[minX, minY, maybeMinZ], [maxX, maxY, maybeMaxZ]], [x, y, maybeZ]) => {
			const z = maybeZ || 0
			const maxZ = maybeMaxZ || 0
			const minZ = maybeMinZ || 0
			return [
				[x < minX ? x : minX, y < minY ? y : minY, z < minZ ? z : minZ],
				[x > maxX ? x : maxX, y > maxY ? y : maxY, z > maxZ ? z : maxZ],
			]
		},
		[vertices[0], vertices[0]]
	)
}

function centerVertices(boundingBox, vertices) {
	const [[minX, minY, minZ], [maxX, maxY, maxZ]] = boundingBox
	const [transX, transY, transZ] = [
		(minX + maxX) / 2.0,
		(minY + maxY) / 2.0,
		(minZ + maxZ) / 2.0,
	]

	const translate = ([x, y, maybeZ]) => {
		return [x - transX, y - transY, (maybeZ || 0) - transZ]
	}

	return vertices.map(translate)
}
