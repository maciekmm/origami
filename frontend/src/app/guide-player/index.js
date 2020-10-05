import React from "react"
import ViewerHeader from "@dom-components/viewer-header"
import PlaybackControls from "@dom-components/playback-controls"
import Player from "@dom-components/player"
import Timeline from "@dom-components/timeline"

import {
	getNextSteadyFrameId,
	getPreviousSteadyFrameId,
	isSteady,
} from "../../fold/steadyness"
import { usePlayerStore } from "@store/player"
import { LOAD_MODEL, SELECT_FRAME } from "../../store/viewer/actions"
import {
	PAUSE,
	PLAY,
	SELECT_NEXT_FRAME,
	SELECT_PREVIOUS_FRAME,
	STOP,
} from "../../store/player/actions"

export default function GuideViewer() {
	const [{ model, frame, playing }, dispatch] = usePlayerStore()

	const loadModel = (model) => dispatch({ type: LOAD_MODEL, model: model })
	const play = () => dispatch({ type: PLAY })
	const pause = () => dispatch({ type: PAUSE })
	const stop = () => dispatch({ type: STOP })
	const selectNextFrame = () => dispatch({ type: SELECT_NEXT_FRAME })
	const selectPreviousFrame = () => dispatch({ type: SELECT_PREVIOUS_FRAME })
	const selectFrame = (frame) => dispatch({ type: SELECT_FRAME, frame: frame })

	return (
		<>
			<ViewerHeader model={model} loadModel={loadModel}>
				{model && (
					<PlaybackControls
						stop={stop}
						selectFrame={selectFrame}
						selectNextFrame={selectNextFrame}
						selectPreviousFrame={selectPreviousFrame}
						play={play}
						currentFrameId={frame}
						playing={playing}
						pause={pause}
						loadModel={loadModel}
						isCurrentFrameSteady={isSteady(model.file_frames[frame])}
						previousSteadyFrameId={getPreviousSteadyFrameId(
							model.file_frames,
							frame
						)}
						nextSteadyFrameId={getNextSteadyFrameId(model.file_frames, frame)}
						isLastFrame={frame === model.file_frames.length - 1}
					/>
				)}
			</ViewerHeader>
			{model && (
				<Player
					step={selectNextFrame}
					pause={pause}
					playing={playing}
					model={model}
					frame={frame}
				/>
			)}
			{model && (
				<Timeline model={model} frame={frame} selectFrame={selectFrame} />
			)}
		</>
	)
}
