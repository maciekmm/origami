import React, { useState } from "react"
import { useStore } from "../../store"
import Header from "./header"
import Player from "./player"
import Timeline from "@dom-components/timeline"
import { SELECT_FRAME } from "../../store/actions"

export default function GuideViewer() {
	const [model, setModel] = useState()
	const [frame, setFrame] = useState(() => -1)
	const [playing, setPlaying] = useState(() => false)

	// const [{ model, frame }, dispatch] = useStore()

	const selectFrame = (frame) => dispatch({ type: SELECT_FRAME, frame: frame })

	return (
		<>
			<Header />
			{model && <Player />}
			{model && (
				<Timeline model={model} frame={frame} selectFrame={selectFrame} />
			)}
		</>
	)
}
