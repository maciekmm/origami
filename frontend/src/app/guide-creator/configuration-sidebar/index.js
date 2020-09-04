import React, { useMemo } from "react"
import EdgeConfiguration from "@dom-components/configuration-edge"
import FileConfiguration from "@dom-components/configuration-file"
import StepConfiguration from "@dom-components/configuration-step"
import styles from "./styles.css"
import { useStore } from "../../../store"
import { downloadModel } from "../../../download"
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

export default function ConfigurationSidebar() {
	const [{ model, frame, selectedEdge }, dispatch] = useStore()

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

	const assignment = useMemo(() => getEdgeArrayProperty("assignment"), [
		selectedEdge,
		model.file_frames,
	])
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
				onSave={() => downloadModel(model)}
				author={model.file_author}
				onAuthorChange={setFileAuthor}
				title={model.file_title}
				onTitleChange={setFileTitle}
				description={model.file_description}
				onDescriptionChange={setFileDescription}
			/>
		</div>
	)
}
