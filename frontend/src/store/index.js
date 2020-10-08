import React, { useReducer } from "react"

import {
	initialState as playerInitialState,
	reducer as playerReducer,
} from "@store/player/reducer"
import {
	initialState as creatorInitialState,
	reducer as creatorReducer,
} from "@store/creator/reducer"

export const StoreContext = React.createContext()

export const StoreProvider = ({ children }) => (
	<StoreContext.Provider
		value={{
			player: useReducer(playerReducer, playerInitialState),
			creator: useReducer(creatorReducer, creatorInitialState),
			auth: useReducer(),
		}}
	>
		{children}
	</StoreContext.Provider>
)

export const useStore = (namespace) => {
	const stores = React.useContext(StoreContext)
	return stores[namespace]
}
