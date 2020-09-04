import { SELECT_FRAME, LOAD_MODEL } from "./actions"
import preprocessFOLDModel from "@fold/preprocess"
import crane from "../../../../assets/models/crane.fold"

export const initialState = {
	model: preprocessFOLDModel(crane),
	frame: 0,
}

export function reducer(state, action) {
	switch (action.type) {
		case SELECT_FRAME:
			return {
				...state,
				frame: action.frame,
			}
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
