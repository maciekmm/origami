import { markFrameSteady } from "./steadyness"
import { FRAME_RATE_PROPERTY } from "./properties"

export const DEFAULT_FRAME_RATE = 24
export const DEFAULT_CREATOR = "Origuide - https://origami.wtf"

export default function preprocessFOLDModel(foldModel) {
	moveRootFrameToFileFrames(foldModel)

	markFrameSteady(foldModel.file_frames[0])
	markFrameSteady(foldModel.file_frames[foldModel.file_frames.length - 1])

	setDefaultFrameRate(foldModel)
	setDefaultCreator(foldModel)

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
