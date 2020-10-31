import React from "react"
import TimelineStep from "../timeline-step"
import { getSteadyFrameIds } from "@fold/steadyness"
import styles from "./styles.css"
import { Viewer } from "../viewer"

export default function Timeline({
	model,
	frame,
	selectFrame,
	removableSteps,
	onRemove,
	children,
}) {
	const steadyIds = model ? getSteadyFrameIds(model.file_frames) : []

	const steps = steadyIds.map((steadyFrameId, sequence) => {
		const state = model.file_frames[steadyFrameId]
		const title = state.frame_title || `Step ${sequence}`
		const selected =
			frame >= steadyFrameId &&
			frame < (steadyIds[sequence + 1] || Number.MAX_SAFE_INTEGER)

		return (
			<TimelineStep
				frame={steadyFrameId}
				selected={selected}
				title={title}
				onClick={() => selectFrame(steadyFrameId)}
				key={steadyFrameId}
				removable={removableSteps && removableSteps.includes(steadyFrameId)}
				onRemove={() => onRemove(steadyFrameId)}
			>
				<Viewer model={model} frame={steadyFrameId} />
			</TimelineStep>
		)
	})

	return (
		<aside className={styles.timeline}>
			{steps}
			{children}
		</aside>
	)
}
