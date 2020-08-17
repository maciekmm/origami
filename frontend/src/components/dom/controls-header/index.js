import React from "react"
import PlaybackControls from "@dom-components/playback-controls"
import ModelLoader from "@dom-components/model-loader"
import styles from "./styles.css"

export default function ControlsHeader({
	playing,
	model,
	play,
	pause,
	stop,
	selectNextFrame,
	selectPreviousFrame,
	loadModel,
}) {
	return (
		<header className={styles.header}>
			<ModelLoader loadModel={loadModel} name={!!model && model.file_author} />
			{model && (
				<PlaybackControls
					playing={playing}
					play={play}
					pause={pause}
					stop={stop}
					nextFrame={selectNextFrame}
					prevFrame={selectPreviousFrame}
				/>
			)}
		</header>
	)
}
