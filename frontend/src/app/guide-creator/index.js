import React, { useEffect } from "react"
import ViewerHeader from "@dom-components/viewer-header"
import Viewer from "@dom-components/viewer"
import Timeline from "@dom-components/timeline"
import Grid from "@material-ui/core/Grid"
import crane from "../../../../assets/models/traditionalCrane_foldangle.fold"
import ConfigurationSidebar from "./configuration-sidebar"
import { TimelineStepAdd } from "@dom-components/timeline-step-add"
import { useStore } from "../../store"
import { LOAD_MODEL, SELECT_FRAME } from "../../store/viewer/actions"
import { ADD_STEP, REMOVE_STEP, SELECT_EDGE } from "../../store/creator/actions"

export default function GuideCreator() {
	const [{ model, frame, selectedEdge }, dispatch] = useStore()
	useEffect(() => dispatch({ type: LOAD_MODEL, model: crane }), [])

	const selectEdge = (edge) => dispatch({ type: SELECT_EDGE, edge: edge })

	return (
		<>
			<ViewerHeader
				model={model}
				loadModel={(model) => dispatch({ type: LOAD_MODEL, model: model })}
			/>
			{model && (
				<>
					<Grid container style={{ flexGrow: 1, height: "100%" }}>
						<Grid item xs={10}>
							<Viewer
								model={model}
								frame={frame}
								onEdgeSelect={selectEdge}
								selectedEdge={selectedEdge}
							/>
						</Grid>
						<Grid item xs>
							<ConfigurationSidebar />
						</Grid>
					</Grid>
					<Timeline
						model={model}
						frame={frame}
						selectFrame={(frame) =>
							dispatch({ type: SELECT_FRAME, frame: frame })
						}
						removableSteps={
							model.file_frames.length === 1
								? []
								: [model.file_frames.length - 1]
						}
						onRemove={() => dispatch({ type: REMOVE_STEP })}
					>
						<TimelineStepAdd addStep={() => dispatch({ type: ADD_STEP })} />
					</Timeline>
				</>
			)}
		</>
	)
}
