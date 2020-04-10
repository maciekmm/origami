import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export default class THREEViewer {
    constructor(width, height) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75, 
            width / height,
            0.1,
            1000
        )
        this.camera.position.set(-10, -5, 5)
        this.renderer = new THREE.WebGLRenderer() // TODO: fallback
        this.renderer.setSize(width, height)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.frontMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            color: new THREE.Color(1, 0, 0),
            side: THREE.FrontSide,
        });

        this.backMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            color: new THREE.Color(0, 1, 0),
            side: THREE.BackSide,
        });
    }

    onResize(width, height) {
        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
    }

    clear() {
        if (!this.mesh) return
        this.mesh.geometry.dispose()
        this.scene.remove(this.mesh)
        this.mesh = null
    }

    setGuide(guide) {
        this.clear()
        this.guide = guide
        this.mesh = new THREE.Mesh(guide.geometry, this.frontMaterial)
        this.mesh.add(new THREE.Mesh(guide.geometry, this.backMaterial))
        this.scene.add(this.mesh)
    }

    render(element) {
        element.appendChild(this.renderer.domElement)
        this._lastRender = performance.now()
        requestAnimationFrame(this._update.bind(this))
    }

    get isPlaying() {
        return this._playing
    }

    play() {
        this._playing = true
        this._lastFrame = performance.now()
    }

    pause() {
        this._playing = false
    }

    step() {
        this.guide.step()
    }

    get _getMillisecondsPerFrame() {
        if(!this.guide) {
            return 0
        }
        return 1000 / this.guide.frameRate
    }

    _shouldRender(time) {
        return !!this.guide && time - this._lastRender> this._getMillisecondsPerFrame
    }

    _shouldStep(time) {
        return this.isPlaying && !!this.guide && time - this._lastFrame > this._getMillisecondsPerFrame;
    }

    _tryStep(time) {
        if(!this._shouldStep(time)) {
            return false
        }

        this._lastFrame = time
        if(!this.guide.step() || this.guide.isInSteadyState) {
            this.pause()
            return false
        } 
        return true
    }

    _update(time) {
        requestAnimationFrame(this._update.bind(this))

        let stepped = this._tryStep(time)

        if(stepped || this._shouldRender(time)) {
            this._lastRender = time
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        }
    }
}