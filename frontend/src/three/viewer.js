import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const VIEWER_FRAMERATE = 30

export default class THREEViewer {
    constructor(element) {
        this._element = element
        let width = this._element.clientWidth
        let height = this._element.clientHeight
        this._scene = new THREE.Scene()
        this._camera = new THREE.PerspectiveCamera(
            75, 
            width / height,
            0.1,
            1000
        )
        this._camera.position.set(-10, -5, 5)
        this._renderer = new THREE.WebGLRenderer() // TODO: fallback
        this._renderer.setSize(width, height)
        this._controls = new OrbitControls(this._camera, this._renderer.domElement)

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
        this._frameRate = VIEWER_FRAMERATE
        this.onResize()
    }

    onResize() {
        let width = this._element.clientWidth
        let height = this._element.clientHeight
        this._renderer.setSize(width, height)
        this._camera.aspect = width / height
    }

    clear() {
        if (!this._mesh) return
        this._mesh.geometry.dispose()
        this._scene.remove(this._mesh)
        this._mesh = null
    }

    set guide(guide) {
        this.clear()
        this._guide = guide
        this._frameRate = Math.max(guide.frameRate, VIEWER_FRAMERATE)
        this._mesh = new THREE.Mesh(guide.geometry, this.frontMaterial)
        this._mesh.add(new THREE.Mesh(guide.geometry, this.backMaterial))
        this._scene.add(this._mesh)
    }

    start() {
        this._element.appendChild(this._renderer.domElement)
        this._lastRender = performance.now()
        requestAnimationFrame(this._render.bind(this))
    }

    get _getMillisecondsPerFrame() {
        return 1000 / this._frameRate
    }

    _shouldRender(time) {
        return !!this._guide && time - this._lastRender> this._getMillisecondsPerFrame
    }

    _render(time) {
        requestAnimationFrame(this._render.bind(this))

        if(this._shouldRender(time)) {
            this._lastRender = time
            this._controls.update()
            this._renderer.render(this._scene, this._camera)
        }
    }

}