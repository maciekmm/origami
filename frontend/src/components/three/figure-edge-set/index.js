import React, { useEffect, useState } from "react"
import { BufferAttribute, BufferGeometry } from "three"

export default function EdgeSet({
	vertices,
	edges,
	color,
	assignment,
	lineWidth,
}) {
	const [geometry] = useState(() => new BufferGeometry())

	useEffect(() => {
		const edgesToVertexIndices = new Uint16Array(edges.length * 2)
		edges.forEach(([vertexFromId, vertexToId], i) => {
			edgesToVertexIndices[2 * i] = vertexFromId
			edgesToVertexIndices[2 * i + 1] = vertexToId
		})
		geometry.setIndex(new BufferAttribute(edgesToVertexIndices, 1))

		geometry.setDrawRange(0, edges.length * 2)
	}, [edges, geometry])

	useEffect(() => {
		const vertexPositions = new Float32Array(vertices.length * 3)
		geometry.setAttribute("position", new BufferAttribute(vertexPositions, 3))
	}, [vertices.length, geometry])

	useEffect(() => {
		const vertexPositions = geometry.attributes.position.array
		vertices.forEach(([x, y, z], i) => {
			vertexPositions[i * 3] = x
			vertexPositions[i * 3 + 1] = y
			vertexPositions[i * 3 + 2] = z || 0
		})

		geometry.attributes.position.needsUpdate = true
		geometry.computeBoundingBox()
		geometry.computeBoundingSphere()
	}, [vertices, geometry])

	useEffect(
		() => () => {
			geometry.dispose()
		},
		[geometry]
	)

	return (
		<lineSegments renderOrder={1} userData={{ assignment: assignment }}>
			<primitive attach="geometry" object={geometry} />
			<lineBasicMaterial
				linewidth={lineWidth || 2.5}
				color={color}
				attach="material"
			></lineBasicMaterial>
		</lineSegments>
	)
}
