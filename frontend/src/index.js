import React from "react"
import ReactDOM from "react-dom"

// import { StoreProvider } from "./store"
// import reducer, { initialState } from "./store/reducer"
import "../public/style.css"
import GuideViewer from "./app/guide-viewer"
import GuideCreator from "./app/guide-creator"

export default function AppWithStore() {
	return (
		// <GuideCreator />
		<GuideViewer />
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
