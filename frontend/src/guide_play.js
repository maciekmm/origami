import {THREEModel} from './three/model'

export const STEADY_STATE = "origuide:steady_state"

export class GuidePlay extends THREEModel {
    constructor(frames) {
        super()
        this.frames = frames
        this.currentFrameId = -1
        this.step()
    }
 
    get frameCount() {
        return this.frames.length
    }

    get currentFrame() {
        return this.frames[this.currentFrameId]
    }

    get isFinished() {
        return this.currentFrameId + 1 >= this.frameCount
    }

    _isSteadyState(frame) {
        return frame.frame_classes.indexOf(STEADY_STATE) != -1
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
                    this.setVertexPosition(id, ...position)
                }
            )
            return
        }
        this.clear()

        frame.vertices_coords.forEach(
            position => this.addVertex(...position)
        )

        frame.faces_vertices.forEach(
            vertices => this.addFace(vertices)
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
        // this.currentFrameId = (this.currentFrameId + 1 ) % this.frames.length

        this._selectFrame(this.currentFrame)
        return true
    }
}