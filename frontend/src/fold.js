export const STEADY_STATE = "origuide:steady_state"

export function parseFOLD(foldModel) {
    if(!!foldModel.frame_classes) {
        foldModel.frame_classes = [STEADY_STATE]
    } else {
        foldModel.frame_classes = [...foldModel.frame_classes, STEADY_STATE]
    }
    if(!foldModel.file_frames) {
        return new Fold([foldModel], 24)
    }
    return new Fold([foldModel, ...foldModel.file_frames], 24)
}

export class Fold {
    constructor(frames, frameRate) {
        this.frameRate = frameRate 
        this.frames = frames
    }
}