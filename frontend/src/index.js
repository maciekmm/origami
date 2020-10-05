import React from "react"
import ReactDOM from "react-dom"
import "../public/style.css"
import GuidePlayer from "./app/guide-player"
import GuideCreator from "./app/guide-creator"
import { BrowserRouter, HashRouter, Route } from "react-router-dom"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ButtonLink from "@dom-components/button-link"
import { StoreProvider } from "@store"

const Router =
	process.env.NODE_ENV !== "production" ? HashRouter : BrowserRouter

function AppWithStore() {
	return (
		<StoreProvider>
			<Router>
				<AppBar position="static">
					<Toolbar variant="dense">
						<Typography variant="h6">Origuide</Typography>
						<ButtonLink to="/" exact title="View" />
						<ButtonLink to="/create" title="Create" />
					</Toolbar>
				</AppBar>
				<Route exact path="/">
					<GuidePlayer />
				</Route>
				<Route path="/create">
					<GuideCreator />
				</Route>
			</Router>
		</StoreProvider>
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
