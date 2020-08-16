import React from "react"
import PlayArrow from "@material-ui/icons/PlayArrow"
import Pause from "@material-ui/icons/Pause"
import Stop from "@material-ui/icons/Stop"
import ArrowRight from "@material-ui/icons/ArrowRight"
import ArrowLeft from "@material-ui/icons/ArrowLeft"
import styles from "./styles.css"

export default function PlaybackControls({
	playing,
	prevFrame,
	play,
	nextFrame,
	pause,
	stop,
}) {
	return (
		<div className={styles.controls}>
			{!playing && <ArrowLeft onClick={prevFrame} />}
			{!playing && <PlayArrow onClick={play} />}
			{!playing && <ArrowRight onClick={nextFrame} />}
			{playing && <Pause onClick={pause} />}
			<Stop onClick={stop} />
		</div>
	)
}
