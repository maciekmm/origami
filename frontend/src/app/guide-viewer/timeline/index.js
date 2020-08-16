import React from "react"
import TimelineStep from "../../../components/timeline-step"
import { useStore } from "../../../store"
import { getSteadyFrameIds } from "../../../fold/steadyness"
import styles from "./styles.css"
import { SELECT_FRAME } from "../../../store/actions"

export default function Timeline() {
	const [{ model, frame }, dispatch] = useStore()

	const selectFrame = (frame) => dispatch({ type: SELECT_FRAME, frame: frame })

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
				onClick={() => selectFrame(steadyFrameId)}
				key={steadyFrameId}
			/>
		)
	})

	return <aside className={styles.timeline}>{steps}</aside>
}
