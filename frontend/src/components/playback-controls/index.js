import React from "react"
import PlayArrow from "@material-ui/icons/PlayArrow"
import Pause from "@material-ui/icons/Pause"
import Stop from "@material-ui/icons/Stop"
import ArrowRight from "@material-ui/icons/ArrowRight"
import ArrowLeft from "@material-ui/icons/ArrowLeft"
import Slider from "@material-ui/core/Slider"
import Grid from "@material-ui/core/Grid"
import styles from "./styles.css"

export default function PlaybackControls({
	playing,
	prevFrame,
	play,
	nextFrame,
	pause,
	stop,
	currentFrame,
	previousSteadyFrameId,
	nextSteadyFrameId,
	selectFrame,
}) {
	const handleScrubbing = (_, newFrame) => {
		pause()
		selectFrame(newFrame)
	}

	return (
		<Grid
			container
			justify="flex-end"
			alignItems="center"
			spacing={5}
			style={{ width: "100%" }}
		>
			<Grid item xs={6}>
				<Slider
					value={currentFrame}
					onChange={handleScrubbing}
					min={previousSteadyFrameId}
					max={nextSteadyFrameId - 1}
					aria-labelledby="continuous-slider"
				/>
			</Grid>
			<ArrowLeft onClick={prevFrame} color={playing ? "disabled" : "inherit"} />
			{!playing && <PlayArrow onClick={play} />}
			{playing && <Pause onClick={pause} />}
			<ArrowRight
				onClick={nextFrame}
				color={playing ? "disabled" : "inherit"}
			/>
			<Stop onClick={stop} />
		</Grid>
	)
}
