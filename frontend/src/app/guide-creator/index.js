import React, { useRef } from "react"
import ViewerHeader from "@dom-components/viewer-header"
import { Viewer } from "@dom-components/viewer"
import Timeline from "@dom-components/timeline"
import Grid from "@material-ui/core/Grid"
import ConfigurationSidebar from "./configuration-sidebar"
import { TimelineStepAdd } from "@dom-components/timeline-step-add"
import { useCreatorStore } from "@store/creator"
import { LOAD_MODEL, SELECT_FRAME } from "../../store/viewer/actions"
import {
	ADD_STEP,
	REMOVE_STEP,
	SELECT_EDGE,
	TOGGLE_EDGE_SELECTION,
} from "../../store/creator/actions"
import styles from "./style.css"

export default function GuideCreator() {
	const [{ model, frame, selectedEdges }, dispatch] = useCreatorStore()

	const selectEdge = (edge, isToggleMode) => {
		const action = isToggleMode ? TOGGLE_EDGE_SELECTION : SELECT_EDGE
		dispatch({ type: action, edge: edge })
	}
	const selectFrame = (frame) => dispatch({ type: SELECT_FRAME, frame: frame })
	const removeStep = () => dispatch({ type: REMOVE_STEP })
	const canvasRef = useRef()

	const snapshotCanvas = () => {
		const canvas = canvasRef.current
		return canvas.toDataURL()
	}

	return (
		<>
			<ViewerHeader
				model={model}
				loadModel={(model) => dispatch({ type: LOAD_MODEL, model: model })}
			/>
			{model && (
				<>
					<Grid container className={styles.viewer}>
						<Grid item xs={10}>
							<Viewer
								ref={canvasRef}
								model={model}
								frame={frame}
								onEdgeSelect={selectEdge}
								selectedEdges={selectedEdges}
							/>
						</Grid>
						<Grid item xs>
							<ConfigurationSidebar thumbnailFactory={snapshotCanvas} />
						</Grid>
					</Grid>
					<Timeline
						model={model}
						frame={frame}
						selectFrame={selectFrame}
						removableSteps={
							model.file_frames.length === 1
								? []
								: [model.file_frames.length - 1]
						}
						onRemove={removeStep}
					>
						<TimelineStepAdd addStep={() => dispatch({ type: ADD_STEP })} />
					</Timeline>
				</>
			)}
		</>
	)
}
