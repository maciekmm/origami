import React, { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import FoldGeometry from "../../three/fold-geometry"

export default function Figure(props) {
	const [foldGeometry] = useState(() => new FoldGeometry())
	const edgesGeometry = useRef(new THREE.EdgesGeometry(foldGeometry.geometry))

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

	useEffect(() => {
		if (!!edgesGeometry.current) {
			edgesGeometry.current.dispose()
		}
		edgesGeometry.current = new THREE.WireframeGeometry(foldGeometry.geometry)
	}, [model, frame])

	useEffect(
		() => () => {
			foldGeometry.dispose()
			edgesGeometry.current.dispose()
		},
		[foldGeometry]
	)

	return (
		<mesh>
			<lineSegments renderOrder={1}>
				<primitive attach="geometry" object={foldGeometry.geometry} />
				<lineBasicMaterial
					linewidth={2}
					color={0xffffff}
					depthTest={false}
					attach="material"
				></lineBasicMaterial>
			</lineSegments>
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
