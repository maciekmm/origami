import React from "react"
import ReactDOM from "react-dom"

import { reducer, initialState } from "./store/creator/reducer"
import "../public/style.css"
import GuideViewer from "./app/guide-viewer"
import GuideCreator from "./app/guide-creator"
import { StoreProvider } from "./store"

function AppWithStore() {
	return (
		<StoreProvider reducer={reducer} initialState={initialState}>
			<GuideCreator />
		</StoreProvider>
		// <GuideViewer />
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
