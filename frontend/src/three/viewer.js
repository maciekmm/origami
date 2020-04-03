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
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    onResize(width, height) {
        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
    }

    clear() {
        if (!this.mesh) return
        this.scene.remove(this.mesh)
        this.mesh = null
    }

    set model(model) {
        this.clear()
        const frontMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            color: new THREE.Color(1, 0, 0),
            side: THREE.FrontSide,
        });
        const backMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            color: new THREE.Color(0, 1, 0),
            side: THREE.BackSide,
        });
        this.mesh = new THREE.Mesh(model.geometry, frontMaterial)
        this.mesh.add(new THREE.Mesh(model.geometry, backMaterial))
        this.scene.add(this.mesh)
    }

    start() {
        requestAnimationFrame(this.update.bind(this))
    }

    update(time) {
        requestAnimationFrame(this.update.bind(this))
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }
}