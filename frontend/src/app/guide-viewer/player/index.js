import React from "react"
import Viewer from "@dom-components/viewer"
import { useStore } from "../../../store"
import { isSteady } from "@fold/steadyness"
import { useAfter } from "../../../hooks"
import styles from "./styles.css"
import { SELECT_NEXT_FRAME, PAUSE } from "../../../store/actions"
import { FRAME_RATE_PROPERTY } from "@fold/properties"

export default function Player() {
	const [{ model, frame, playing }, dispatch] = useStore()

	const step = () => dispatch({ type: SELECT_NEXT_FRAME })
	const pause = () => dispatch({ type: PAUSE })
	const isLastFrame = model.file_frames.length === frame + 1

	useAfter(
		() => {
			if (!playing) {
				return
			}

			if (isLastFrame) {
				pause()
				return
			}

			step()

			if (isSteady(model.file_frames[frame + 1])) {
				pause()
			}
		},
		1000 / model[FRAME_RATE_PROPERTY],
		[playing, frame, model]
	)

	return (
		<div className={styles.player}>
			<Viewer model={model} frame={frame} />
		</div>
	)
}
