import React, { useEffect, useMemo, useRef } from "react"
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

function SceneConfiguration({ innerRef }) {
	const {
		camera,
		gl: { domElement },
	} = useThree()

	if (innerRef !== undefined && innerRef !== null) {
		innerRef.current = domElement
	}

	const [lightRef] = useResource()

	useFrame(() => {
		lightRef.current.position.copy(camera.position)
	})

	return (
		<>
			<orbitControls args={[camera, domElement]} />
			<ambientLight intensity={0.4} />
			<pointLight ref={lightRef} intensity={0.5} />
		</>
	)
}

export const Viewer = React.forwardRef(function Viewer(
	{ model, frame, onEdgeSelect, selectedEdges },
	forwardRef
) {
	const facesVertices = useMemo(
		() => getComputedProperty(model.file_frames, 0, "faces_vertices"),
		[model.file_frames]
	)

	const edgesVertices = useMemo(
		() => getComputedProperty(model.file_frames, 0, "edges_vertices"),
		[model.file_frames]
	)

	const verticesCoords = useMemo(
		() => getComputedProperty(model.file_frames, frame, "vertices_coords"),
		[model.file_frames, frame]
	)

	const edgesAssignment = useMemo(
		() => getComputedProperty(model.file_frames, frame, "edges_assignment"),
		[model.file_frames, frame]
	)

	return (
		<Canvas gl={{ preserveDrawingBuffer: true, autoClear: false }}>
			<SceneConfiguration innerRef={forwardRef} />
			<Figure
				verticesCoords={verticesCoords}
				facesVertices={facesVertices}
				edgesAssignment={edgesAssignment}
				edgesVertices={edgesVertices}
				onEdgeSelect={onEdgeSelect}
				selectedEdges={selectedEdges || []}
			/>
		</Canvas>
	)
})
