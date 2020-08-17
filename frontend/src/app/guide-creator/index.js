import React, { useState } from "react"
import ViewerHeader from "@dom-components/viewer-header"
import Viewer from "@dom-components/viewer"
import preprocessFoldModel from "@fold/preprocess"
import Timeline from "@dom-components/timeline"

export default function GuideCreator() {
	const [model, setModel] = useState()
	const [frame, setFrame] = useState(() => -1)

	const loadModel = (model) => {
		setFrame(0)
		setModel(preprocessFoldModel(model))
	}
	const selectNextFrame = () =>
		setFrame(Math.min(frame + 1, model.file_frames.length - 1))
	const selectPreviousFrame = () => setFrame(Math.max(frame - 1, 0))

	return (
		<>
			<ViewerHeader model={model} loadModel={loadModel} />
			{model && <Viewer model={model} frame={frame} />}
			{model && <Timeline model={model} frame={frame} selectFrame={setFrame} />}
		</>
	)
}
