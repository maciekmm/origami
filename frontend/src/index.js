import React from "react"
import ReactDOM from "react-dom"

import {
	initialState as creatorInitialState,
	reducer as creatorReducer,
} from "./store/creator/reducer"
import {
	initialState as playerInitialState,
	reducer as playerReducer,
} from "./store/player/reducer"
import "../public/style.css"
import GuidePlayer from "./app/guide-player"
import GuideCreator from "./app/guide-creator"
import { StoreProvider } from "./store"
import { BrowserRouter, Route } from "react-router-dom"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ButtonLink from "@dom-components/button-link"

function AppWithStore() {
	return (
		<BrowserRouter>
			<AppBar position="static">
				<Toolbar variant="dense">
					<Typography variant="h6">Origuide</Typography>
					<ButtonLink to="/" exact title="View" />
					<ButtonLink to="/create" title="Create" />
				</Toolbar>
			</AppBar>
			<StoreProvider reducer={playerReducer} initialState={playerInitialState}>
				<Route exact path="/">
					<GuidePlayer />
				</Route>
			</StoreProvider>
			<StoreProvider
				reducer={creatorReducer}
				initialState={creatorInitialState}
			>
				<Route path="/create">
					<GuideCreator />
				</Route>
			</StoreProvider>
		</BrowserRouter>
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
