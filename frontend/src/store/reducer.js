import {
	SELECT_FRAME,
	SELECT_NEXT_FRAME,
	SELECT_PREVIOUS_FRAME,
	LOAD_MODEL,
	PLAY,
	PAUSE,
	STOP,
} from "./actions"

import preprocessFOLDModel from "../fold/preprocess"

const initialModel = preprocessFOLDModel(
	require("../../../assets/models/diagonal_fold_animated.fold")
)

export const initialState = {
	model: initialModel,
	frame: 0,
	playing: false,
}

export default function reducer(state, action) {
	switch (action.type) {
		case SELECT_FRAME:
			return {
				...state,
				frame: action.frame,
			}
		case SELECT_NEXT_FRAME:
			return {
				...state,
				frame: Math.min(state.frame + 1, state.model.file_frames.length - 1),
			}
		case SELECT_PREVIOUS_FRAME:
			return {
				...state,
				frame: Math.max(state.frame - 1, 0),
			}
		case LOAD_MODEL:
			return {
				...state,
				model: action.model,
				frame: 0,
			}
		case PLAY:
			return {
				...state,
				playing: true,
			}
		case PAUSE:
			return {
				...state,
				playing: false,
			}
		case STOP:
			return {
				...state,
				playing: false,
				frame: 0,
			}
		default:
			throw new Error(`action type ${action.type} not recognized`)
	}
}
