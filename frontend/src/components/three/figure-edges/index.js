import React, { useState, useMemo, useEffect, useRef } from "react"
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

const RAYCASTER_LINE_THRESHOLD = 0.03
const MAXIMUM_MOUSE_DISPLACEMENT_FOR_EDGE_TO_SELECT = 0.02
const SELECTED_EDGE_WIDTH = 10

export default function FigureEdges({
	edgesVertices,
	edgesAssignment,
	vertices,
	selectedEdges,
	onEdgeSelect,
}) {
	const { camera, mouse } = useThree()
	const [edgeSetsRef, edgeSets] = useResource()

	const edgesPerAssignment = useMemo(() => {
		const edgesPerAssignment = {}
		for (let assignment in ASSIGNMENT_COLORS) {
			edgesPerAssignment[assignment] = []
		}

		edgesAssignment.forEach((assignment, i) => {
			edgesPerAssignment[assignment].push([i, edgesVertices[i]])
		})
		return edgesPerAssignment
	}, [edgesAssignment, edgesVertices])

	const mousePosition = useRef(mouse)

	const handleEdgePreSelect = () => (mousePosition.current = mouse.clone())

	const raycaster = useMemo(() => {
		const raycaster = new THREE.Raycaster()
		raycaster.params.Line.threshold = RAYCASTER_LINE_THRESHOLD
		return raycaster
	}, [])

	const handleEdgeSelect = (e) => {
		if (
			!onEdgeSelect ||
			mousePosition.current.distanceTo(mouse) >
				MAXIMUM_MOUSE_DISPLACEMENT_FOR_EDGE_TO_SELECT
		) {
			return
		}
		e.stopPropagation()
		const isToggleMode = e.ctrlKey

		raycaster.setFromCamera(mouse, camera)

		const intersects = raycaster.intersectObjects(edgeSets.children)
		if (intersects.length === 0) {
			onEdgeSelect(null, isToggleMode)
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

		onEdgeSelect(edgeId, isToggleMode)
	}

	const isSelected = (edgeId) => selectedEdges.indexOf(edgeId) !== -1

	return (
		<group
			ref={edgeSetsRef}
			onPointerDown={handleEdgePreSelect}
			onClick={handleEdgeSelect}
		>
			{Object.keys(edgesPerAssignment)
				.filter((assignment) => edgesPerAssignment[assignment].length > 0)
				.map((assignment) => [
					<EdgeSet
						key={assignment}
						vertices={vertices}
						edges={edgesPerAssignment[assignment]
							.filter(([id, _]) => !isSelected(id))
							.map(([_, vertices]) => vertices)}
						color={ASSIGNMENT_COLORS[assignment]}
						assignment={assignment}
					></EdgeSet>,
					<EdgeSet
						key={`selected-${assignment}`}
						vertices={vertices}
						edges={edgesPerAssignment[assignment]
							.filter(([id, _]) => isSelected(id))
							.map(([_, vertices]) => vertices)}
						color={ASSIGNMENT_COLORS[assignment]}
						assignment={assignment}
						lineWidth={SELECTED_EDGE_WIDTH}
					></EdgeSet>,
				])}
		</group>
	)
}
