import React, { useMemo } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
	Canvas,
	extend,
	useThree,
	useFrame,
	useResource,
} from "react-three-fiber"
import Figure from "@three-components/figure"
import { getComputedProperty } from "@fold/properties"

extend({ OrbitControls })

function SceneConfiguration() {
	const {
		camera,
		gl: { domElement },
	} = useThree()

	const [lightRef, light] = useResource()

	useFrame(() => {
		lightRef.current.position.copy(camera.position)
	})

	return (
		<>
			<orbitControls args={[camera, domElement]} />
			<ambientLight intensity={0.3} />
			<pointLight ref={lightRef} intensity={0.8} />
		</>
	)
}

export default function Viewer({ model, frame }) {
	const facesVertices = useMemo(
		() => getComputedProperty(model.file_frames, 0, "faces_vertices"),
		[model]
	)

	const edgesVertices = useMemo(
		() => getComputedProperty(model.file_frames, 0, "edges_vertices"),
		[model]
	)

	const verticesCoords = useMemo(
		() => getComputedProperty(model.file_frames, frame, "vertices_coords"),
		[model, frame]
	)

	const edgesAssignment = useMemo(
		() => getComputedProperty(model.file_frames, frame, "edges_assignment"),
		[model, frame]
	)

	return (
		<Canvas>
			<SceneConfiguration />
			<Figure
				verticesCoords={verticesCoords}
				facesVertices={facesVertices}
				edgesAssignment={edgesAssignment}
				edgesVertices={edgesVertices}
			/>
		</Canvas>
	)
}