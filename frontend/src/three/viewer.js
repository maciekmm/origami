import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const FRAME_RATE = 24

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

    isPlaying() {
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
        return 1000 / FRAME_RATE
    }

    get _shouldRender() {
        return time - this._lastRender> this._getMillisecondsPerFrame
    }

    _update(time) {
        requestAnimationFrame(this._update.bind(this))

        if(this.isPlaying() && !!this.guide) {
            if(time - this._lastFrame > this._getMillisecondsPerFrame) {
                this._lastFrame = time
                if(this.guide.step()) {
                    this.pause()
                }
            }
        }

        if(this._lastFrame == time || this._shouldRender) {
            this._lastRender = time
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        }
    }
}