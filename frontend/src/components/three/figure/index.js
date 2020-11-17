import React, { useState, useEffect, useMemo } from "react"
import { FaceColors, FrontSide, BackSide } from "three"
import FoldGeometry from "../../../three/fold-geometry"
import FigureEdges from "../figure-edges"

const POLYGON_OFFSET_FACTOR = 1

export default function Figure({
	verticesCoords,
	facesVertices,
	edgesVertices,
	edgesAssignment,
	onEdgeSelect,
	selectedEdges,
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
				selectedEdges={selectedEdges}
			></FigureEdges>
			<meshPhongMaterial
				side={FrontSide}
				color={0x31d631}
				vertexColors={FaceColors}
				attach="material"
				polygonOffset={true}
				flatShading={true}
				polygonOffsetFactor={POLYGON_OFFSET_FACTOR}
				shininess={0}
			></meshPhongMaterial>
			<primitive attach="geometry" object={foldGeometry.geometry} />
			<mesh>
				<meshPhongMaterial
					side={BackSide}
					color={0xeeeeee}
					vertexColors={FaceColors}
					attach="material"
					flatShading={true}
					polygonOffset={true}
					polygonOffsetFactor={POLYGON_OFFSET_FACTOR}
					shininess={0}
				></meshPhongMaterial>
				<primitive attach="geometry" object={foldGeometry.geometry} />
			</mesh>
		</mesh>
	)
}
