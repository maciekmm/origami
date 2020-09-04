import React from "react"
import ReactDOM from "react-dom"

import {
	reducer as creatorReducer,
	initialState as creatorInitialState,
} from "./store/creator/reducer"
import {
	reducer as playerReducer,
	initialState as playerInitialState,
} from "./store/player/reducer"
import "../public/style.css"
import GuideViewer from "./app/guide-player"
import GuideCreator from "./app/guide-creator"
import { StoreProvider } from "./store"
import { BrowserRouter, Switch, Route, Link } from "react-router-dom"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

function AppWithStore() {
	return (
		<BrowserRouter>
			<AppBar position="static">
				<Toolbar variant="dense">
					<Typography variant="h6">Origuide</Typography>
					<Link to="/">
						<Button style={{ color: "#fff" }}>View</Button>
					</Link>
					<Link to="/create">
						<Button style={{ color: "#fff" }}>Create</Button>
					</Link>
				</Toolbar>
			</AppBar>
			<Switch>
				<Route exact path="/">
					<StoreProvider
						reducer={playerReducer}
						initialState={playerInitialState}
					>
						<GuideViewer />
					</StoreProvider>
				</Route>
				<Route path="/create">
					<StoreProvider
						reducer={creatorReducer}
						initialState={creatorInitialState}
					>
						<GuideCreator />
					</StoreProvider>
				</Route>
			</Switch>
		</BrowserRouter>
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
