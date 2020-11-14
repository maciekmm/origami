import React, { useEffect, useRef, useState } from "react"
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
import { useHistory, useParams } from "react-router-dom"
import { useCommunityService } from "../../services/community"
import { modelToBase64 } from "../../download"
import { useSnackbar } from "notistack"
import { useCommunityStore } from "@store/community"

export default function GuideCreator() {
	const [{ model, frame, selectedEdges }, dispatch] = useCreatorStore()
	const [{ userId }] = useCommunityStore()

	const { guideId } = useParams()
	const isEditingGuide = guideId !== undefined && guideId !== null
	const { fetchGuide } = useCommunityService()
	const { createGuide, updateGuide } = useCommunityService()
	const [isPrivate, setPrivate] = useState(false)
	const [isOwner, setIsOwner] = useState(false)

	useEffect(() => {
		if (!isEditingGuide) {
			return
		}
		fetchGuide(guideId)
			.then((guide) => guide.json())
			.then((guide) => {
				setIsOwner(guide["owner"] === userId)
				setPrivate(guide["private"])
				return fetch(guide["guide_file"])
			})
			.then((resp) => resp.json())
			.then((loadedGuide) => dispatch({ type: LOAD_MODEL, model: loadedGuide }))
	}, [guideId, fetchGuide, dispatch])

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

	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()

	const upsertGuide = () => {
		const base64Representation = modelToBase64(model)
		if (!model.file_title) {
			enqueueSnackbar("Title cannot be empty", { variant: "error" })
			return
		}
		const thumbnail = snapshotCanvas()

		const isUpdating = isEditingGuide && isOwner

		const upload = isUpdating
			? (...params) => updateGuide(guideId, ...params)
			: createGuide

		upload(
			"data:text/json;base64," + base64Representation,
			isPrivate,
			thumbnail
		)
			.then((response) => response.json())
			.then((guide) => {
				if ("id" in guide) {
					const successAction = isUpdating ? "updated" : "created"
					enqueueSnackbar(`Guide ${successAction}`, { variant: "success" })
					history.push("/")
				} else {
					enqueueSnackbar("Error creating guide ", { variant: "error" })
				}
			})
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
							<ConfigurationSidebar
								uploadGuide={upsertGuide}
								isPrivate={isPrivate}
								setPrivate={setPrivate}
							/>
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
