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
import { AccountDropdown } from "./app/account-dropdown"
import { GuideBrowser } from "./app/guide-browser"
import { SnackbarProvider } from "notistack"
import { LoginPage } from "./app/login"
import { RegisterPage } from "./app/register"
import Grid from "@material-ui/core/Grid"
import { SettingsPage } from "./app/settings"
import { EmailPasswordReset } from "./app/email-password-reset"
import { ResetPassword } from "./app/reset-password"

const Router =
	process.env.NODE_ENV !== "production" ? HashRouter : BrowserRouter

function AppWithStore() {
	return (
		<SnackbarProvider maxSnack={3}>
			<StoreProvider>
				<Router>
					<AppBar position="static">
						<Toolbar variant="dense">
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
							>
								<Typography variant="h6">Origuide</Typography>
								<Grid>
									<ButtonLink to="/" title="Browse" />
									<ButtonLink to="/view" title="View" />
									<ButtonLink to="/create" title="Create" />
								</Grid>
								<AccountDropdown></AccountDropdown>
							</Grid>
						</Toolbar>
					</AppBar>
					<Route exact path="/" component={GuideBrowser} />
					<Route path={["/view/:guideId", "/view"]} component={GuidePlayer} />
					<Route
						path={["/create/:guideId", "/create"]}
						component={GuideCreator}
					/>
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
					<Route path="/settings" component={SettingsPage} />
					<Route exact path="/reset-password" component={EmailPasswordReset} />
					<Route path="/reset-password/:token" component={ResetPassword} />
				</Router>
			</StoreProvider>
		</SnackbarProvider>
	)
}

ReactDOM.render(<AppWithStore />, document.getElementById("app"))
