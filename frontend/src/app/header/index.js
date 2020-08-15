import React from "react"
import PlaybackControls from "../../components/playback-controls"
import Grid from "@material-ui/core/Grid"
import ModelLoader from "../../components/model-loader"
import { useStore } from "../../store"
import styles from "./styles.css"
import {
	PLAY,
	PAUSE,
	STOP,
	SELECT_FRAME,
	SELECT_NEXT_FRAME,
	SELECT_PREVIOUS_FRAME,
	LOAD_MODEL,
} from "../../store/actions"
import preprocessFOLDModel from "../../fold/preprocess"
import {
	getNextSteadyFrameId,
	getPreviousSteadyFrameId,
	isSteady,
} from "../../fold/steadyness"

export default function Header() {
	const [{ playing, model, frame }, dispatch] = useStore()

	const play = () => dispatch({ type: PLAY })
	const pause = () => dispatch({ type: PAUSE })
	const stop = () => dispatch({ type: STOP })
	const nextFrame = () => dispatch({ type: SELECT_NEXT_FRAME })
	const prevFrame = () => dispatch({ type: SELECT_PREVIOUS_FRAME })
	const selectFrame = (frame) => dispatch({ type: SELECT_FRAME, frame: frame })

	const loadModel = (model) =>
		dispatch({ type: LOAD_MODEL, model: preprocessFOLDModel(model) })

	return (
		<Grid container className={styles.header}>
			<Grid item xs={2}>
				<ModelLoader
					loadModel={loadModel}
					name={!!model && model.file_author}
				/>
			</Grid>
			{model && (
				<Grid item xs>
					<PlaybackControls
						playing={playing}
						play={play}
						pause={pause}
						stop={stop}
						nextFrame={nextFrame}
						prevFrame={prevFrame}
						currentFrameId={frame}
						isCurrentFrameSteady={isSteady(model.file_frames[frame])}
						previousSteadyFrameId={getPreviousSteadyFrameId(
							model.file_frames,
							frame
						)}
						nextSteadyFrameId={getNextSteadyFrameId(model.file_frames, frame)}
						selectFrame={selectFrame}
						isLastFrame={frame === model.file_frames.length - 1}
					/>
				</Grid>
			)}
		</Grid>
	)
}
