import React, { useState, useEffect, useMemo } from "react"
import * as THREE from "three"
import FoldGeometry from "../../../three/fold-geometry"
import FigureEdges from "../figure-edges"

const POLYGON_OFFSET_FACTOR = 1

export default function Figure({
	verticesCoords,
	facesVertices,
	edgesVertices,
	edgesAssignment,
	onEdgeSelect,
	selectedEdge,
}) {
	const [foldGeometry] = useState(() => new FoldGeometry())

	useEffect(() => {
		foldGeometry.clear()

		verticesCoords.forEach((position) => {
			foldGeometry.addVertex(...position)
		})

		facesVertices.forEach((vertices) => foldGeometry.addFace(vertices))
	}, [facesVertices, verticesCoords, foldGeometry])

	useEffect(() => {
		verticesCoords.forEach((position, id) =>
			foldGeometry.setVertexPosition(id, ...position)
		)
	}, [verticesCoords, foldGeometry])

	useEffect(() => () => foldGeometry.dispose(), [foldGeometry])

	return (
		<mesh>
			<FigureEdges
				edgesAssignment={edgesAssignment}
				edgesVertices={edgesVertices}
				vertices={verticesCoords}
				onEdgeSelect={onEdgeSelect}
				selectedEdge={selectedEdge}
			></FigureEdges>
			<meshPhongMaterial
				side={THREE.FrontSide}
				color={0x22ff22}
				vertexColors={THREE.FaceColors}
				attach="material"
				polygonOffset={true}
				flatShading={true}
				polygonOffsetFactor={POLYGON_OFFSET_FACTOR}
			></meshPhongMaterial>
			<primitive attach="geometry" object={foldGeometry.geometry} />
			<mesh>
				<meshPhongMaterial
					side={THREE.BackSide}
					color={0xeeeeee}
					vertexColors={THREE.FaceColors}
					attach="material"
					flatShading={true}
					polygonOffset={true}
					polygonOffsetFactor={POLYGON_OFFSET_FACTOR}
				></meshPhongMaterial>
				<primitive attach="geometry" object={foldGeometry.geometry} />
			</mesh>
		</mesh>
	)
}
