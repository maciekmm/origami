import React from "react"

import {
	initialState as playerInitialState,
	reducer as playerReducer,
} from "@store/player/reducer"
import {
	initialState as creatorInitialState,
	reducer as creatorReducer,
} from "@store/creator/reducer"

export const StoreContext = React.createContext()

const useCombinedReducer = (reducers) => {
	let combinedInitialState = {}
	let reducerMapping = {}
	for (let key in reducers) {
		const [reducer, initialState] = reducers[key]
		combinedInitialState[key] = initialState
		reducerMapping[key] = reducer
	}

	const combinedReducer = (state, action) => {
		const { __reducerKey, ...payload } = action
		const reducer = reducerMapping[__reducerKey]
		let newState = {
			...state,
		}
		newState[__reducerKey] = reducer(state[__reducerKey], payload)
		return newState
	}

	return React.useReducer(combinedReducer, combinedInitialState)
}

export const StoreProvider = ({ children }) => (
	<StoreContext.Provider
		value={useCombinedReducer({
			player: [playerReducer, playerInitialState],
			creator: [creatorReducer, creatorInitialState],
		})}
	>
		{children}
	</StoreContext.Provider>
)

export const useStore = (reducerKey) => {
	const [state, dispatch] = React.useContext(StoreContext)

	const innerDispatch = (payload) =>
		dispatch({ ...payload, __reducerKey: reducerKey })
	return [state[reducerKey], innerDispatch]
}
