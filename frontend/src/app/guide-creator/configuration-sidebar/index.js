import React, { useMemo, useState } from "react"
import EdgeConfiguration from "@dom-components/configuration-edge"
import FileConfiguration from "@dom-components/configuration-file"
import StepConfiguration from "@dom-components/configuration-step"
import styles from "./styles.css"
import { useCreatorStore } from "@store/creator"
import { downloadModel, modelToBase64 } from "../../../download"
import { getComputedProperty } from "@fold/properties"
import {
	SET_EDGE_ASSIGNMENT,
	SET_EDGE_TARGET_ANGLE,
	SET_FILE_AUTHOR,
	SET_FILE_DESCRIPTION,
	SET_FILE_TITLE,
	SET_STEP_DESCRIPTION,
	SET_STEP_TITLE,
} from "../../../store/creator/actions"
import { useCommunityService } from "../../../services/community"
import { useIsAuthenticated } from "@store/community"
import { useSnackbar } from "notistack"
import { useHistory } from "react-router-dom"

export default function ConfigurationSidebar({ thumbnailFactory }) {
	const [{ model, frame, selectedEdge }, dispatch] = useCreatorStore()

	const currentStep = model && model.file_frames[frame]

	const getEdgeArrayProperty = (property) => {
		if (selectedEdge === null) return null
		const value = getComputedProperty(
			model.file_frames,
			frame,
			"edges_" + property
		)
		if (value === undefined) {
			return value
		}
		return value[selectedEdge]
	}

	/* eslint-disable react-hooks/exhaustive-deps */
	const assignment = useMemo(() => getEdgeArrayProperty("assignment"), [
		selectedEdge,
		model.file_frames,
	])

	/* eslint-disable react-hooks/exhaustive-deps */
	const targetAngle = useMemo(() => getEdgeArrayProperty("targetAngle"), [
		selectedEdge,
		model.file_frames,
	])

	const setAssignment = (assignment) =>
		dispatch({ type: SET_EDGE_ASSIGNMENT, assignment: assignment })
	const setTargetAngle = (targetAngle) =>
		dispatch({ type: SET_EDGE_TARGET_ANGLE, targetAngle: targetAngle })
	const setFileTitle = (title) =>
		dispatch({ type: SET_FILE_TITLE, title: title })
	const setFileDescription = (description) =>
		dispatch({ type: SET_FILE_DESCRIPTION, description: description })
	const setFileAuthor = (author) =>
		dispatch({ type: SET_FILE_AUTHOR, author: author })
	const setStepDescription = (description) =>
		dispatch({ type: SET_STEP_DESCRIPTION, description: description })
	const setStepTitle = (title) =>
		dispatch({ type: SET_STEP_TITLE, title: title })

	const [isPrivate, setPrivate] = useState(false)

	const { createGuide } = useCommunityService()
	const isAuthed = useIsAuthenticated()
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()

	const uploadGuide = (model) => {
		const base64Representation = modelToBase64(model)
		if (!model.file_title) {
			enqueueSnackbar("Title cannot be empty", { variant: "error" })
			return
		}
		const thumbnail = thumbnailFactory()

		createGuide(
			"data:text/json;base64," + base64Representation,
			isPrivate,
			thumbnail
		)
			.then((response) => response.json())
			.then((guide) => {
				if ("id" in guide) {
					enqueueSnackbar("Guide created", { variant: "success" })
					history.push("/")
				} else {
					enqueueSnackbar("Error creating guide ", { variant: "error" })
				}
			})
	}

	const saveModel = () =>
		!isAuthed ? downloadModel(model) : uploadGuide(model)

	return (
		<div className={styles.sidebar}>
			{assignment && (
				<EdgeConfiguration
					assignment={assignment}
					onAssignmentChange={setAssignment}
					targetAngle={targetAngle || ""}
					onTargetAngleChange={setTargetAngle}
				/>
			)}
			<StepConfiguration
				title={currentStep.frame_title || ""}
				onTitleChange={setStepTitle}
				description={currentStep.frame_description || ""}
				onDescriptionChange={setStepDescription}
			/>
			<FileConfiguration
				onSave={saveModel}
				saveTitle="Save"
				author={model.file_author || ""}
				onAuthorChange={setFileAuthor}
				title={model.file_title || ""}
				onTitleChange={setFileTitle}
				description={model.file_description || ""}
				onDescriptionChange={setFileDescription}
				private={isPrivate}
				showPrivate={isAuthed}
				onPrivateChange={setPrivate}
			/>
		</div>
	)
}
