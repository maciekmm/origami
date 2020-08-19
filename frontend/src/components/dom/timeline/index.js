import React from "react"
import TimelineStep from "../timeline-step"
import { getSteadyFrameIds } from "@fold/steadyness"
import styles from "./styles.css"
import Viewer from "../viewer"

export default function Timeline({ model, selectFrame, children }) {
	const steadyIds = model ? getSteadyFrameIds(model.file_frames) : []

	const steps = steadyIds.map((steadyFrameId) => {
		return (
			<TimelineStep
				model={model}
				frame={steadyFrameId}
				title={"Step" + steadyFrameId}
				onClick={() => selectFrame(steadyFrameId)}
				key={steadyFrameId}
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
