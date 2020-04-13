import React from "react"

export const StoreContext = React.createContext()

export const StoreProvider = ({ reducer, initialState, children }) => (
	<StoreContext.Provider value={React.useReducer(reducer, initialState)}>
		{children}
	</StoreContext.Provider>
)

export const useStore = () => React.useContext(StoreContext)
