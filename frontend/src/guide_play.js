import {THREEModel} from './three/model'
import {STEADY_STATE} from './fold'

export class GuidePlay {
    constructor(fold) {
        this.fold = fold
        this.model = new THREEModel()
        this.currentFrameId = -1
        this.step()
    }

    get geometry() {
        return this.model.geometry
    }

    get frames() {
        return this.fold.frames
    }
 
    get frameCount() {
        return this.frames.length
    }
    
    get frameRate() {
        return this.fold.frameRate
    }

    get currentFrame() {
        return this.frames[this.currentFrameId]
    }

    get isFinished() {
        return this.currentFrameId + 1 >= this.frameCount
    }

    _isSteadyState(frame) {
        return frame.frame_classes && frame.frame_classes.indexOf(STEADY_STATE) != -1
    }

    get isInSteadyState() {
        return this._isSteadyState(this.currentFrame)
    }

    get steadyStateIDs() {
        return this.frames
        .map(
            (_, idx) => idx
        )
        .filter(
            frame_idx => this._isSteadyState(this.frames[frame_idx]) 
        );
    }

    _selectFrame(frame) {
        if(!!frame.frame_inherit) {
            frame.vertices_coords.forEach(
                (position, id) => {
                    this.model.setVertexPosition(id, ...position)
                }
            )
            return
        }
        this.model.clear()

        frame.vertices_coords.forEach(
            position => this.model.addVertex(...position)
        )

        frame.faces_vertices.forEach(
            vertices => this.model.addFace(vertices)
        )
    }

    selectFrame(frame_id) {
        this._selectFrame(this.frames[frame_id])
    }

    step() {
        if(this.isFinished) {
            console.warn("no next frame for transition found")
            return false
        }
        this.currentFrameId++

        this._selectFrame(this.currentFrame)
        return true
    }
}