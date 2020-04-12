import { STEADY_STATE } from './tools'

const FRAME_RATE_PROPERTY = "file_og:frameRate"
const DEFAULT_FRAME_RATE = 24

export default function preprocessFOLDModel(foldModel) {
    const frame = extractFrameFromRoot(foldModel)
    
    if(!foldModel.file_frames) {
        foldModel.file_frames = []
    }
    foldModel.file_frames = [frame, ...foldModel.file_frames]

    markFrameSteady(foldModel.file_frames[0])
    markFrameSteady(foldModel.file_frames[foldModel.file_frames.length - 1])

    // set default frame rate
    if (!foldModel.hasOwnProperty(FRAME_RATE_PROPERTY)) {
        foldModel[FRAME_RATE_PROPERTY] = DEFAULT_FRAME_RATE
    }

    return foldModel
}

function extractFrameFromRoot(foldModel) {
    let firstFrame = {}
    for (let property in foldModel) {
        const value = foldModel[property]

        if (!property.startsWith("file_")) {
            firstFrame[property] = value
            delete foldModel[property]
        }
    }
    return firstFrame
}

function markFrameSteady(frame) {
    if (!frame.frame_classes) {
        frame.frame_classes = [STEADY_STATE]
    } else if (frame.frame_classes.indexOf(STEADY_STATE) == -1) {
        frame.frame_classes = [...frame.frame_classes, STEADY_STATE]
    }
}