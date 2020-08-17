import React from "react"
import PlayArrow from "@material-ui/icons/PlayArrow"
import Pause from "@material-ui/icons/Pause"
import Stop from "@material-ui/icons/Stop"
import ArrowRight from "@material-ui/icons/ArrowRight"
import ArrowLeft from "@material-ui/icons/ArrowLeft"
import Slider from "@material-ui/core/Slider"
import Grid from "@material-ui/core/Grid"

export default function PlaybackControls({
	playing,
	selectPreviousFrame,
	play,
	selectNextFrame,
	pause,
	stop,
	currentFrameId,
	isCurrentFrameSteady,
	previousSteadyFrameId,
	nextSteadyFrameId,
	selectFrame,
	isLastFrame,
}) {
	const handleScrubbing = (_, newFrame) => {
		pause()
		selectFrame(newFrame)
	}

	const firstStepOfTransition =
		isCurrentFrameSteady && !isLastFrame
			? currentFrameId
			: previousSteadyFrameId

	const lastStepOfTransition = isLastFrame
		? currentFrameId
		: nextSteadyFrameId - 1

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
					value={currentFrameId}
					onChange={handleScrubbing}
					min={firstStepOfTransition}
					max={lastStepOfTransition}
					aria-labelledby="continuous-slider"
				/>
			</Grid>
			<ArrowLeft
				onClick={selectPreviousFrame}
				color={playing ? "disabled" : "inherit"}
			/>
			{!playing && <PlayArrow onClick={play} />}
			{playing && <Pause onClick={pause} />}
			<ArrowRight
				onClick={selectNextFrame}
				color={playing ? "disabled" : "inherit"}
			/>
			<Stop onClick={stop} />
		</Grid>
	)
}
