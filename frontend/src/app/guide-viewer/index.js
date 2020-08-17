import React, { useState } from "react"
import ControlsHeader from "@dom-components/controls-header"
import Player from "./player"
import preprocessFoldModel from "@fold/preprocess"
import Timeline from "@dom-components/timeline"

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
			<ControlsHeader
				playing={playing}
				model={model}
				stop={stop}
				selectFrame={selectFrame}
				selectNextFrame={selectNextFrame}
				selectPreviousFrame={selectPreviousFrame}
				play={play}
				pause={pause}
				loadModel={loadModel}
			/>
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
