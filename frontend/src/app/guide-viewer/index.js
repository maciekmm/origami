import React, { useState } from "react"
import ViewerHeader from "@dom-components/viewer-header"
import PlaybackControls from "@dom-components/playback-controls"
import Player from "@dom-components/player"
import preprocessFoldModel from "@fold/preprocess"
import Timeline from "@dom-components/timeline"

import {
	getNextSteadyFrameId,
	getPreviousSteadyFrameId,
	isSteady,
} from "../../fold/steadyness"

export default function GuideViewer() {
	const [model, setModel] = useState()
	const [frame, setFrame] = useState(() => -1)
	const [playing, setPlaying] = useState(() => false)

	const stop = () => {
		setPlaying(false)
		setFrame(0)
	}
	const loadModel = (model) => {
		stop()
		setModel(preprocessFoldModel(model))
	}
	const play = () => setPlaying(true)
	const pause = () => setPlaying(false)
	const selectNextFrame = () =>
		setFrame(Math.min(frame + 1, model.file_frames.length - 1))
	const selectPreviousFrame = () => setFrame(Math.max(frame - 1, 0))
	const selectFrame = (frame) => {
		setFrame(frame)
		pause()
	}

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
