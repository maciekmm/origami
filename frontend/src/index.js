import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as triangulate from 'earcut'


class THREEModel {
    constructor() {
        this.geometry = new THREE.Geometry()
        this.vertices = this.geometry.vertices
        this.faces = this.geometry.faces
    }

    addVertex(x, y, z) {
        const vertexIdx = this.vertices.push(
            new THREE.Vector3(
                x, y, z
            )
        ) - 1
        this.geometry.verticesNeedUpdate = true
        return vertexIdx
    }

    verticesIdsToCoordinates(ids) {
        return ids.flatMap(id => {
            const vertex = this.vertices[id]
            return [vertex.x, vertex.y, vertex.z]
        })
    }

    addFace(vertices) {
        const triangulated = triangulate.default(this.verticesIdsToCoordinates(vertices), null, 3)
        for (let i = 0; i < triangulated.length; i += 3) {
            let indices = [triangulated[i], triangulated[i + 1], triangulated[i + 2]]
                .sort() // keep orientation
                .map(local => vertices[local])//.sort() // map to global index
            this.faces.push(new THREE.Face3(
                ...indices,
                null, new THREE.Color(Math.random(), Math.random(), Math.random())
            ))
        }
        this.geometry.elementsNeedUpdate = true
    }
}

class THREEViewer {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, // TODO: onResize
            0.1,
            1000
        )
        this.camera.position.set(-10, -5, 5)
        this.renderer = new THREE.WebGLRenderer() // TODO: fallback
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
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

const viewer = new THREEViewer()

async function renderModel(modelURL) {
    const fetched = await fetch(modelURL)
    const model = await fetched.json()

    if (!model['vertices_coords']) {
        console.error("missing vertices_coords in loaded model")
        return
    }
    const threeModel = new THREEModel()
    model['vertices_coords'].forEach(
        position => threeModel.addVertex(...position)
    )

    model['faces_vertices'].forEach(
        verticeIds => threeModel.addFace(verticeIds)
    )

    viewer.model = threeModel
}

const model = "models/huffman.fold"
renderModel(model)
viewer.start()