import { STEADY_STATE } from "./tools"

export const FRAME_RATE_PROPERTY = "file_og:frameRate"
export const DEFAULT_FRAME_RATE = 24

export default function preprocessFOLDModel(foldModel) {
	moveRootFrameToFileFrames(foldModel)

	markFrameSteady(foldModel.file_frames[0])
	markFrameSteady(foldModel.file_frames[foldModel.file_frames.length - 1])

	setDefaultFrameRate(foldModel)

	return foldModel
}

export function indirect(foldModel) {
	setDefaultFrameRate(foldModel)
}

export function setDefaultFrameRate(foldModel) {
	if (Object.prototype.hasOwnProperty.call(foldModel, FRAME_RATE_PROPERTY)) {
		return
	}
	foldModel[FRAME_RATE_PROPERTY] = DEFAULT_FRAME_RATE
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

export function markFrameSteady(frame) {
	if (!frame.frame_classes) {
		frame.frame_classes = [STEADY_STATE]
	} else if (frame.frame_classes.indexOf(STEADY_STATE) == -1) {
		frame.frame_classes = [...frame.frame_classes, STEADY_STATE]
	}
}
