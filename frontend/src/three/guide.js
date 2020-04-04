import {THREEState} from './state.js'

const SET_STATE = "origuide:set_state"

export default class THREEGuide {
    constructor(frames) {
        this.frames = frames
        this.state = this._createState(frames[0])
        this.currentFrameId = 0
    }

    get frameCount() {
        return this.frames.length
    }

    _createState(frame) {
        if(!!frame.frame_inherit) {
            throw "base frame for the transition has to contain the whole state"
        }
        const state = new THREEState()

        frame.vertices_coords.forEach(
            position => state.addVertex(...position)
        )

        frame.faces_vertices.forEach(
            vertices => state.addFace(vertices)
        )
        return state
    }

    /**
     * returns true if there's a next frame to be displayed
     */
    step() {
        if(this.isFinished()) {
            console.warn("no next frame for transition found")
            return this.isSetState()
        }
        this.currentFrameId++// = (this.currentFrameId + 1 ) % this.frames.length

        const frame = this.currentFrame

        if(!frame.frame_inherit) {
            //TODO: we can't recreate THREEState here because viewer cannot update geometry
            // this.state = this._createState(frame)
        }

        if(!frame.vertices_coords) {
            throw "expected vertices coordinates to change"
        }

        // console.log("????")
        frame.vertices_coords.forEach(
            (position, id) => {
                this.state.setVertexPosition(id, ...position)
            }
        )
        
        return this.isSetState()
    }

    get currentFrame() {
        return this.frames[this.currentFrameId]
    }

    isFinished() {
        return this.currentFrameId + 1 >= this.frameCount
    }

    isSetState() {
        return this.currentFrame.frame_classes.indexOf(SET_STATE) != -1
    }

    get geometry() {
        return this.state.geometry
    }
}