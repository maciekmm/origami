import { SELECT_FRAME, LOAD_MODEL } from "./actions"
import preprocessFOLDModel from "@fold/preprocess"

export const initialState = {
	model: null,
	frame: 0,
}

export function reducer(state, action) {
	switch (action.type) {
		case SELECT_FRAME:
			return {
				...state,
				frame: action.frame,
			}
		// case SELECT_NEXT_FRAME:
		//     return {
		//         ...state,
		//         frame: Math.min(state.frame + 1, state.viewer.file_frames.length - 1),
		//     }
		// case SELECT_PREVIOUS_FRAME:
		//     return {
		//         ...state,
		//         frame: Math.max(state.frame - 1, 0),
		//     }
		case LOAD_MODEL:
			return {
				...state,
				model: preprocessFOLDModel(action.model),
				frame: 0,
			}
		default:
			throw new Error(`action type ${action.type} not recognized`)
	}
}
