import {
	PAUSE,
	PLAY,
	SELECT_NEXT_FRAME,
	SELECT_PREVIOUS_FRAME,
	STOP,
} from "./actions"

import {
	initialState as viewerInitialState,
	reducer as viewerReducer,
} from "../viewer/reducer"

export const initialState = {
	...viewerInitialState,
	playing: false,
}

export function reducer(state, action) {
	switch (action.type) {
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
		case STOP:
			return {
				...state,
				playing: false,
				frame: 0,
			}
		case PAUSE:
			return {
				...state,
				playing: false,
			}
		case PLAY:
			return {
				...state,
				playing: true,
			}
		default:
			return {
				...viewerReducer(state, action),
				playing: false,
			}
	}
}
