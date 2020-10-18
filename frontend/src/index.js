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
import Button from "@material-ui/core/Button"
import { AccountDropdown } from "./app/account-dropdown"
import { GuideBrowser } from "./app/guide-browser"

const Router =
	process.env.NODE_ENV !== "production" ? HashRouter : BrowserRouter

function AppWithStore() {
	return (
		<StoreProvider>
			<Router>
				<AppBar position="static">
					<Toolbar variant="dense">
						<Typography variant="h6">Origuide</Typography>
						<div>
							<ButtonLink to="/" title="Browse" />
							<ButtonLink to="/view" exact title="View" />
							<ButtonLink to="/create" title="Create" />
						</div>
						<AccountDropdown></AccountDropdown>
					</Toolbar>
				</AppBar>
				<Route exact path="/">
					<GuideBrowser />
				</Route>
				<Route path="/view/:guideId">
					<GuidePlayer />
				</Route>
				<Route path="/create">
					<GuideCreator />
				</Route>
				<Route path="/login"></Route>
				<Route path="/register"></Route>
			</Router>
		</StoreProvider>
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
