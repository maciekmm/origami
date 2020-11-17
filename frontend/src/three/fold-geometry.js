import { Vector3, Face3, Geometry } from "three"
import { triangulate } from "./triangulation"

export default class FoldGeometry {
	constructor() {
		this.geometry = new Geometry()
		this.vertices = this.geometry.vertices
		this.faces = this.geometry.faces
	}

	clear() {
		this.vertices.length = 0
		this.faces.length = 0
	}

	dispose() {
		this.geometry.dispose()
	}

	addVertex(x, y, z = 0) {
		const vertexIdx = this.vertices.push(new Vector3(x, y, z)) - 1
		this.geometry.verticesNeedUpdate = true
		return vertexIdx
	}

	_verticesIdsToCoordinates(ids) {
		return ids.flatMap((id) => {
			const vertex = this.vertices[id]
			return [vertex.x, vertex.y, vertex.z]
		})
	}

	addFace(vertices) {
		const triangulated = triangulate(
			this._verticesIdsToCoordinates(vertices),
			vertices
		)
		triangulated.forEach((indices) =>
			this.faces.push(new Face3(...indices, null))
		)
		this.geometry.elementsNeedUpdate = true
		this.geometry.normalsNeedUpdate = true
		this.geometry.uvsNeedUpdate = true
		this.geometry.computeVertexNormals()
	}

	setVertexPosition(id, x, y, z = 0) {
		const vertex = this.vertices[id]
		if (!vertex) {
			throw "error setting position, no vertex with " + id + " found"
		}
		vertex.x = x
		vertex.y = y
		vertex.z = z
		this.geometry.verticesNeedUpdate = true
		this.geometry.normalsNeedUpdate = true
		this.geometry.uvsNeedUpdate = true
		this.geometry.computeVertexNormals()
	}
}
