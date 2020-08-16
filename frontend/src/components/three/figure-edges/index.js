import React, { useState, useMemo } from "react"
import * as THREE from "three"
import {
	getComputedProperty,
	findEdgeIdFromVertexIndices,
} from "@fold/properties"
import EdgeSet from "../figure-edge-set"
import { useThree, useResource } from "react-three-fiber"

const ASSIGNMENT_COLORS = {
	M: 0xff0000,
	V: 0x0000ff,
	B: 0x000000,
	U: 0x000000,
	F: 0x000000,
	C: 0x00ff00,
}

const RAYCASTER_LINE_THRESHOLD = 0.1

export default function FigureEdges({ frame, model, onEdgeSelect }) {
	const { camera, mouse } = useThree()
	const [raycaster] = useState(() => {
		const raycaster = new THREE.Raycaster()
		raycaster.params.Line.threshold = RAYCASTER_LINE_THRESHOLD
		return raycaster
	})
	const [edgeSetsRef, edgeSets] = useResource()

	const currentFrame = model.file_frames[frame]
	// NOTE: assumption is made that edge to vertex association never changes
	const baseFrame = model.file_frames[0]

	const edgesAssignment = getComputedProperty(
		model.file_frames,
		frame,
		"edges_assignment"
	)

	const edgesPerAssignment = useMemo(() => {
		const edgesPerAssignment = {}
		for (let assignment in ASSIGNMENT_COLORS) {
			edgesPerAssignment[assignment] = []
		}

		edgesAssignment.forEach((assignment, i) => {
			edgesPerAssignment[assignment].push(baseFrame["edges_vertices"][i])
		})
		return edgesPerAssignment
	}, [edgesAssignment, baseFrame])

	const handleEdgeSelection = () => {
		if (!onEdgeSelect) {
			return
		}
		raycaster.setFromCamera(mouse, camera)
		const intersects = raycaster.intersectObjects(edgeSets.children)

		if (intersects.length === 0) {
			return
		}

		const idx = intersects[0].index
		const idxNear = idx % 2 === 0 ? idx + 1 : idx - 1

		const geometry = intersects[0].object.geometry
		const [vertexFrom, vertexTo] = [
			geometry.index.array[idx],
			geometry.index.array[idxNear],
		]

		onEdgeSelect(
			findEdgeIdFromVertexIndices(model.file_frames, vertexFrom, vertexTo)
		)
	}

	return (
		<group ref={edgeSetsRef} onClick={handleEdgeSelection}>
			{Object.keys(edgesPerAssignment)
				.filter((assignment) => edgesPerAssignment[assignment].length > 0)
				.map((assignment) => (
					<EdgeSet
						key={assignment}
						vertices={currentFrame.vertices_coords}
						edges={edgesPerAssignment[assignment]}
						color={ASSIGNMENT_COLORS[assignment]}
						assignment={assignment}
					></EdgeSet>
				))}
		</group>
	)
}
