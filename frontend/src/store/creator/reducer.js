import {
	ADD_STEP,
	REMOVE_STEP,
	SELECT_EDGE,
	TOGGLE_EDGE_SELECTION,
	SET_EDGES_ASSIGNMENT,
	SET_EDGES_TARGET_ANGLE,
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
	selectedEdges: [],
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

	const setEdgesArrayProperty = (edges, property, value) => {
		if (edges.length === 0) {
			console.warn(`Tried to change ${property} of no edges`)
			return state
		}
		const prefixedProperty = "edges_" + property
		const currentStep = state.model.file_frames[state.frame]

		const values = [
			...(currentStep[prefixedProperty] ||
				Array(state.model.file_frames[0].edges_vertices.length).fill(null)),
		]
		for (let selectedEdge of edges) {
			values[selectedEdge] = value
		}

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
				selectedEdges: action && action.edge !== null ? [action.edge] : [],
			}
		case TOGGLE_EDGE_SELECTION:
			if (!action || action.edge === null) {
				return state
			}
			const indexInSelectedEdges = state.selectedEdges.indexOf(action.edge)
			if (indexInSelectedEdges !== -1) {
				return {
					...state,
					selectedEdges: [
						...state.selectedEdges.slice(0, indexInSelectedEdges),
						...state.selectedEdges.slice(indexInSelectedEdges + 1),
					],
				}
			} else {
				return {
					...state,
					selectedEdges: [...state.selectedEdges, action.edge],
				}
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
		case SET_EDGES_TARGET_ANGLE:
			return setEdgesArrayProperty(
				action.edges,
				"targetAngle",
				action.targetAngle
			)
		case SET_EDGES_ASSIGNMENT:
			return setEdgesArrayProperty(
				action.edges,
				"assignment",
				action.assignment
			)
		case LOAD_MODEL:
			const viewerState = viewerReducer(state, action)
			markFramesToInheritDeeply(viewerState.model)
			return {
				...viewerState,
				selectedEdges: [],
			}
		default:
			return viewerReducer(state, action)
	}
}
