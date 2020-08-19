import React, { useState } from "react"
import ViewerHeader from "@dom-components/viewer-header"
import Viewer from "@dom-components/viewer"
import preprocessFoldModel from "@fold/preprocess"
import Timeline from "@dom-components/timeline"
import Grid from "@material-ui/core/Grid"

export default function GuideCreator() {
	const [model, setModel] = useState()
	const [frame, setFrame] = useState(() => 0)

	const loadModel = (model) => {
		setFrame(0)
		setModel(preprocessFoldModel(model))
	}

	return (
		<>
			<ViewerHeader model={model} loadModel={loadModel} />
			{model && (
				<>
					<Grid container style={{ height: "100%" }}>
						<Grid item xs={10}>
							<Viewer
								model={model}
								frame={frame}
								onEdgeSelect={(edge) => console.log(edge)}
							/>
						</Grid>
						<Grid item xs>
							test
						</Grid>
					</Grid>
					<Timeline model={model} frame={frame} selectFrame={setFrame} />
				</>
			)}
		</>
	)
}
