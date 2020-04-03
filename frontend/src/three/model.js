import * as THREE from 'three'
import * as triangulate from 'earcut'

export default class THREEModel {
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

    _verticesIdsToCoordinates(ids) {
        return ids.flatMap(id => {
            const vertex = this.vertices[id]
            return [vertex.x, vertex.y, vertex.z]
        })
    }

    _triangulate(vertices) {
        if (vertices.length == 3) return [vertices];
        let local_idxs = []

        if (vertices.length == 4) {
            local_idxs = [
                [0, 1, 2],
                [0, 2, 3]
            ]
        } else {
            const triangulated = triangulate.default(this._verticesIdsToCoordinates(vertices), null, 3)
            for (let i = 0; i < triangulated.length; i += 3) {
                local_idxs.push([triangulated[i], triangulated[i + 1], triangulated[i + 2]].sort())
            }
        }
        return local_idxs.map(local_idxs =>
            local_idxs.map(local_id => vertices[local_id])
        )
    }

    addFace(vertices) {
        const triangulated = this._triangulate(vertices)
        triangulated.forEach(indices => this.faces.push(new THREE.Face3(
            ...indices,
            null, new THREE.Color(Math.max(0.2, Math.random()), Math.max(0.2, Math.random()), Math.max(0.2, Math.random()))
        )))
        this.geometry.elementsNeedUpdate = true
    }
}