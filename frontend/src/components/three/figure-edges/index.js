import React, { useState, useMemo } from "react"
import * as THREE from "three"
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

export default function FigureEdges({
	edgesVertices,
	edgesAssignment,
	vertices,
	onEdgeSelect,
}) {
	const { camera, mouse } = useThree()
	const [raycaster] = useState(() => {
		const raycaster = new THREE.Raycaster()
		raycaster.params.Line.threshold = RAYCASTER_LINE_THRESHOLD
		return raycaster
	})
	const [edgeSetsRef, edgeSets] = useResource()

	const edgesPerAssignment = useMemo(() => {
		const edgesPerAssignment = {}
		for (let assignment in ASSIGNMENT_COLORS) {
			edgesPerAssignment[assignment] = []
		}

		edgesAssignment.forEach((assignment, i) => {
			edgesPerAssignment[assignment].push(edgesVertices[i])
		})
		return edgesPerAssignment
	}, [edgesAssignment, edgesVertices])

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
		const [v1, v2] = [geometry.index.array[idx], geometry.index.array[idxNear]]

		const edgeId = edgesVertices.findIndex(
			([eV1, eV2]) => (eV1 == v1 && eV2 == v2) || (eV1 == v2 && eV2 == v1)
		)
		if (edgeId === -1) {
			console.warn(
				"Edge clicked, but no assignment was found",
				intersects[0].object
			)
			return
		}

		onEdgeSelect(edgeId)
	}

	return (
		<group ref={edgeSetsRef} onClick={handleEdgeSelection}>
			{Object.keys(edgesPerAssignment)
				.filter((assignment) => edgesPerAssignment[assignment].length > 0)
				.map((assignment) => (
					<EdgeSet
						key={assignment}
						vertices={vertices}
						edges={edgesPerAssignment[assignment]}
						color={ASSIGNMENT_COLORS[assignment]}
						assignment={assignment}
					></EdgeSet>
				))}
		</group>
	)
}
