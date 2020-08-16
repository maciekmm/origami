import React from "react"
import TimelineStep from "../timeline-step"
import { getSteadyFrameIds } from "@fold/steadyness"
import styles from "./styles.css"

export default function Timeline({ model, frame, selectFrame }) {
	const steadyIds = model ? getSteadyFrameIds(model.file_frames) : []

	const steps = steadyIds.map((steadyFrameId, seq) => {
		const nextSteadyId = steadyIds.length == seq - 1 ? steadyIds[seq + 1] : null

		const framesBehind = frame - steadyFrameId
		const totalFrames = nextSteadyId - steadyFrameId
		const fracOfFramesCovered = nextSteadyId ? framesBehind / totalFrames : 1

		return (
			<TimelineStep
				model={model}
				frame={steadyFrameId}
				progress={fracOfFramesCovered}
				title={"Step" + frame}
				onClick={() => selectFrame(steadyFrameId)}
				key={steadyFrameId}
			/>
		)
	})

	return <aside className={styles.timeline}>{steps}</aside>
}
