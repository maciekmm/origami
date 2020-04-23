import React, { useState, useEffect } from "react"
import * as THREE from "three"
import FoldGeometry from "../../three/fold-geometry"

export default function Figure(props) {
	const [foldGeometry] = useState(() => new FoldGeometry())

	const model = props.model
	const frame = model.file_frames[props.frame]

	useEffect(() => {
		foldGeometry.clear()
		const baseFrame = model.file_frames[0]

		frame.vertices_coords.forEach((position) => {
			foldGeometry.addVertex(...position)
		})

		baseFrame.faces_vertices.forEach((vertices) =>
			foldGeometry.addFace(vertices)
		)
	}, [model])

	useEffect(() => {
		frame.vertices_coords.forEach((position, id) =>
			foldGeometry.setVertexPosition(id, ...position)
		)
	}, [frame])

	useEffect(() => () => foldGeometry.dispose(), [foldGeometry])

	return (
		<mesh>
			<meshPhongMaterial
				side={THREE.FrontSide}
				color={0xff0000}
				vertexColors={THREE.FaceColors}
				flatShading={true}
				attach="material"
			></meshPhongMaterial>
			<primitive attach="geometry" object={foldGeometry.geometry} />
			<mesh>
				<meshPhongMaterial
					side={THREE.BackSide}
					color={0x00ff00}
					vertexColors={THREE.FaceColors}
					attach="material"
					flatShading={true}
				></meshPhongMaterial>
				<primitive attach="geometry" object={foldGeometry.geometry} />
			</mesh>
		</mesh>
	)
}
