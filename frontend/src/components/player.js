import THREEViewer from '../three/viewer'
import Controls from './controls'
import Timeline from './timeline'

export class Player {
    constructor(element) {
        this.controls = new Controls(element.querySelector("#controls"), this)

        this.viewer = new THREEViewer(element.querySelector("#visualizer"))
        this.viewer.start()

        this.timeline = new Timeline(element.querySelector("#timeline"), this)
        this._playing = false
    }

    set guide(guide) {
        this._guide = guide
        this.timeline.guide = guide
        this.viewer.guide = guide
    }

    get isPlaying() {
        return this._playing
    }

    play() {
        if(this.isPlaying) return
        this._playing = true
        this._lastFrame = performance.now()
        requestAnimationFrame(this._update.bind(this))
    }

    pause() {
        this._playing = false
    }

    step() {
        this._guide.step()
    }

    stop() {
        this.pause()
        this.selectFrame(0)
    }

    selectFrame(frameID) {
        this._guide.selectFrame(frameID)
        this.pause()
    }

    _shouldStep(time) {
        return this.isPlaying && !!this._guide && time - this._lastFrame > this._getMillisecondsPerFrame;
    }

    get _getMillisecondsPerFrame() {
        return 1000 / this._guide.frameRate
    }

    _update(time) {
        if(!this.isPlaying) {
            return
        }
        requestAnimationFrame(this._update.bind(this))

        if(!this._shouldStep(time)) {
            return
        }
        
        this._lastFrame = time
        if(!this._guide.step() || this._guide.isInSteadyState) {
            this.pause()
        }
        
        this.timeline.update()
    }
}