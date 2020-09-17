import {
	ADD_STEP,
	REMOVE_STEP,
	SELECT_EDGE,
	SET_EDGE_ASSIGNMENT,
	SET_EDGE_TARGET_ANGLE,
	SET_FILE_AUTHOR,
	SET_FILE_DESCRIPTION,
	SET_FILE_TITLE,
	SET_STEP_DESCRIPTION,
	SET_STEP_TITLE,
} from "./actions"

import {
	reducer as viewerReducer,
	initialState as viewerInitialState,
} from "../viewer/reducer"
import { STEADY_STATE_CLASS } from "@fold/steadyness"
import { LOAD_MODEL } from "../viewer/actions"
import { markFramesToInheritDeeply } from "@fold/preprocess"

export const initialState = {
	...viewerInitialState,
	model: (() => {
		const model = viewerInitialState.model
		markFramesToInheritDeeply(model)
		return model
	})(),
	selectedEdge: null,
}

export function reducer(state, action) {
	const updateCurrentStep = (newStep) => {
		return {
			...state,
			model: {
				...state.model,
				file_frames: [
					...state.model.file_frames.slice(0, state.frame),
					newStep,
					...state.model.file_frames.slice(
						state.frame + 1,
						state.model.file_frames.length
					),
				],
			},
		}
	}

	const setEdgeArrayProperty = (property, value) => {
		if (!state.selectedEdge) {
			console.warn(`Tried to change ${property} of null edge`)
			return
		}
		const prefixedProperty = "edges_" + property
		const currentStep = state.model.file_frames[state.frame]

		const values = [
			...(currentStep[prefixedProperty] ||
				Array(state.model.file_frames[0].edges_vertices.length).fill(null)),
		]
		values[state.selectedEdge] = value

		const modifiedStep = { ...currentStep }
		modifiedStep[prefixedProperty] = values
		return updateCurrentStep(modifiedStep)
	}

	switch (action.type) {
		case ADD_STEP:
			return {
				...state,
				model: {
					...state.model,
					file_frames: [
						...state.model.file_frames,
						{
							frame_inherit: true,
							"frame_og:inheritDeep": true,
							frame_parent: state.model.file_frames.length - 1,
							frame_classes: [STEADY_STATE_CLASS],
						},
					],
				},
				frame: state.model.file_frames.length,
			}
		case REMOVE_STEP:
			return {
				...state,
				frame: 0,
				model: {
					...state.model,
					file_frames: [
						...state.model.file_frames.slice(
							0,
							state.model.file_frames.length - 1
						),
					],
				},
			}
		case SELECT_EDGE:
			return {
				...state,
				selectedEdge: action.edge,
			}
		case SET_FILE_TITLE:
			return {
				...state,
				model: {
					...state.model,
					file_title: action.title,
				},
			}
		case SET_FILE_DESCRIPTION:
			return {
				...state,
				model: {
					...state.model,
					file_description: action.description,
				},
			}
		case SET_FILE_AUTHOR:
			return {
				...state,
				model: {
					...state.model,
					file_author: action.author,
				},
			}
		case SET_STEP_DESCRIPTION:
			return updateCurrentStep({
				...state.model.file_frames[state.frame],
				frame_description: action.description,
			})
		case SET_STEP_TITLE:
			return updateCurrentStep({
				...state.model.file_frames[state.frame],
				frame_title: action.title,
			})
		case SET_EDGE_TARGET_ANGLE:
			return setEdgeArrayProperty("targetAngle", action.targetAngle)
		case SET_EDGE_ASSIGNMENT:
			return setEdgeArrayProperty("assignment", action.assignment)
		case LOAD_MODEL:
			const viewerState = viewerReducer(state, action)
			markFramesToInheritDeeply(viewerState.model)
			return {
				...viewerState,
				selectedEdge: null,
			}
		default:
			return viewerReducer(state, action)
	}
}
