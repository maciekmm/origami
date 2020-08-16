import React from "react"
import ReactDOM from "react-dom"

import { StoreProvider } from "./store"
import reducer, { initialState } from "./store/reducer"
import "../public/style.css"
import GuideViewer from "./app/guide-viewer"

export default function AppWithStore() {
	return (
		<StoreProvider initialState={initialState} reducer={reducer}>
			<GuideViewer />
		</StoreProvider>
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
