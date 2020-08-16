import React, { useState, useEffect, useMemo } from "react"
import * as THREE from "three"
import { getComputedProperty } from "../../fold/properties"
import EdgeSet from "./edge-set"

const ASSIGNMENT_COLORS = {
	M: 0xff0000,
	V: 0x0000ff,
	B: 0x000000,
	U: 0x000000,
	F: 0x000000,
	C: 0x00ff00,
}

export default function FigureEdges({ frame, model }) {
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

	return (
		<>
			{Object.keys(edgesPerAssignment).map((assignment) => (
				<EdgeSet
					key={assignment}
					vertices={currentFrame.vertices_coords}
					edges={edgesPerAssignment[assignment]}
					color={ASSIGNMENT_COLORS[assignment]}
				></EdgeSet>
			))}
		</>
	)
}
