import * as THREE from 'three'
import { triangulate } from './triangulation'

export default class FoldGeometry {
    constructor() {
        this.geometry = new THREE.Geometry()
        this.vertices = this.geometry.vertices
        this.faces = this.geometry.faces
    }

    clear() {
        this.vertices.length = 0
        this.geometry.length = 0
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

    _verticesIdsToCoordinates(ids) {
        return ids.flatMap(id => {
            const vertex = this.vertices[id]
            return [vertex.x, vertex.y, vertex.z]
        })
    }

    addFace(vertices) {
        const triangulated = triangulate(this._verticesIdsToCoordinates(vertices), vertices)
        triangulated.forEach(indices => this.faces.push(new THREE.Face3(
            ...indices,
            null, new THREE.Color(Math.max(0.2, Math.random()), Math.max(0.2, Math.random()), Math.max(0.2, Math.random()))
        )))
        this.geometry.elementsNeedUpdate = true
    }

    setVertexPosition(id, x, y, z) {
        const vertex = this.vertices[id]
        if (!vertex) {
            throw "error setting position, no vertex with " + id + " found"
        }
        vertex.x = x
        vertex.y = y
        vertex.z = z
        this.geometry.verticesNeedUpdate = true
        this.geometry.elementsNeedUpdate = true
    }
}