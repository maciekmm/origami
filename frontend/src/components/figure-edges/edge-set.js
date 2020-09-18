import React, { useState, useEffect } from "react"
import * as THREE from "three"

export default function EdgeSet({ vertices, edges, color }) {
	const [geometry] = useState(() => new THREE.BufferGeometry())

	useEffect(() => {
		const edgesToVertexIndices = new Uint16Array(vertices.length * 2)
		edges.forEach(([vertexFromId, vertexToId], i) => {
			edgesToVertexIndices[2 * i] = vertexFromId
			edgesToVertexIndices[2 * i + 1] = vertexToId
		})
		geometry.setIndex(new THREE.BufferAttribute(edgesToVertexIndices, 1))

		const vertexPositions = new Float32Array(vertices.length * 3)
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(vertexPositions, 3)
		)
	}, [edges])

	useEffect(() => {
		const vertexPositions = geometry.attributes.position.array
		vertices.forEach(([x, y, z], i) => {
			vertexPositions[i * 3] = x
			vertexPositions[i * 3 + 1] = y
			vertexPositions[i * 3 + 2] = z
		})

		geometry.attributes.position.needsUpdate = true
		geometry.computeBoundingBox()
		geometry.computeBoundingSphere()
	}, [vertices])

	useEffect(() => () => geometry.dispose(), [geometry])

	return (
		<lineSegments renderOrder={1}>
			<primitive attach="geometry" object={geometry} />
			<lineBasicMaterial
				linewidth={1}
				color={color}
				attach="material"
			></lineBasicMaterial>
		</lineSegments>
	)
}