import React, { useMemo } from "react"
import EdgeConfiguration from "@dom-components/configuration-edge"
import FileConfiguration from "@dom-components/configuration-file"
import StepConfiguration from "@dom-components/configuration-step"
import styles from "./styles.css"
import { useCreatorStore } from "@store/creator"
import { downloadModel } from "../../../download"
import { getComputedProperty } from "@fold/properties"
import {
	SET_EDGES_ASSIGNMENT,
	SET_EDGES_TARGET_ANGLE,
	SET_FILE_AUTHOR,
	SET_FILE_DESCRIPTION,
	SET_FILE_TITLE,
	SET_STEP_DESCRIPTION,
	SET_STEP_TITLE,
} from "../../../store/creator/actions"
import { useIsAuthenticated } from "@store/community"
import Button from "@material-ui/core/Button"
import { Link } from "@material-ui/core"
import SaveIcon from "@material-ui/icons/Save"

export default function ConfigurationSidebar({
	uploadGuide,
	isPrivate,
	setPrivate,
}) {
	const [{ model, frame, selectedEdges }, dispatch] = useCreatorStore()

	const currentStep = model && model.file_frames[frame]

	const getSelectedEdgesProperty = (property) => {
		if (selectedEdges.length === 0) return null
		const values = getComputedProperty(
			model.file_frames,
			frame,
			"edges_" + property
		)
		if (values === undefined) {
			return values
		}

		let firstValue = values[selectedEdges[0]]
		for (let selectedEge of selectedEdges) {
			if (values[selectedEge] !== firstValue) {
				firstValue = null
			}
		}

		return firstValue
	}

	/* eslint-disable react-hooks/exhaustive-deps */
	const assignment = useMemo(() => getSelectedEdgesProperty("assignment"), [
		selectedEdges,
		model.file_frames,
	])

	/* eslint-disable react-hooks/exhaustive-deps */
	const targetAngle = useMemo(() => getSelectedEdgesProperty("targetAngle"), [
		selectedEdges,
		model.file_frames,
	])

	const setAssignment = (assignment) =>
		dispatch({
			type: SET_EDGES_ASSIGNMENT,
			edges: selectedEdges,
			assignment: assignment,
		})
	const setTargetAngle = (targetAngle) =>
		dispatch({
			type: SET_EDGES_TARGET_ANGLE,
			edges: selectedEdges,
			targetAngle: targetAngle,
		})
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

	const isAuthed = useIsAuthenticated()
	const saveAction = isAuthed ? uploadGuide : () => downloadModel(model)

	return (
		<div className={styles.sidebar}>
			{selectedEdges.length > 0 && (
				<EdgeConfiguration
					assignment={assignment || ""}
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
				author={model.file_author || ""}
				onAuthorChange={setFileAuthor}
				title={model.file_title || ""}
				onTitleChange={setFileTitle}
				description={model.file_description || ""}
				onDescriptionChange={setFileDescription}
				isPrivate={isPrivate}
				showPrivate={isAuthed}
				onPrivateChange={setPrivate}
			>
				<Button
					variant="outlined"
					color="primary"
					onClick={saveAction}
					startIcon={<SaveIcon />}
				>
					Save
				</Button>
				{isAuthed && (
					<Link
						href="#"
						onClick={(event) => {
							event.preventDefault()
							downloadModel(model)
						}}
						align="right"
						variant="caption"
						color="textSecondary"
					>
						or download model
					</Link>
				)}
			</FileConfiguration>
		</div>
	)
}
