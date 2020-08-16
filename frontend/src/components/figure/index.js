import React, { useState, useEffect } from "react"
import * as THREE from "three"
import FoldGeometry from "../../three/fold-geometry"
import FigureEdges from "../figure-edges"

const POLYGON_OFFSET_FACTOR = 1

export default function Figure({ frame, model, onClick }) {
	const [foldGeometry] = useState(() => new FoldGeometry())

	const fileFrame = model.file_frames[frame]

	useEffect(() => {
		foldGeometry.clear()
		const baseFrame = model.file_frames[0]

		fileFrame.vertices_coords.forEach((position) => {
			foldGeometry.addVertex(...position)
		})

		baseFrame.faces_vertices.forEach((vertices) =>
			foldGeometry.addFace(vertices)
		)
	}, [model])

	useEffect(() => {
		fileFrame.vertices_coords.forEach((position, id) =>
			foldGeometry.setVertexPosition(id, ...position)
		)
	}, [fileFrame])

	useEffect(() => () => foldGeometry.dispose(), [foldGeometry])

	return (
		<mesh>
			<FigureEdges frame={frame} model={model}></FigureEdges>
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
