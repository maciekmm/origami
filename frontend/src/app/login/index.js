import React, { useRef, useState } from "react"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { ContentContainer } from "@dom-components/content-container"
import FormControl from "@material-ui/core/FormControl"
import { useCommunityService } from "../../services/community"
import { useCommunityStore } from "@store/community"
import { LOGIN } from "@store/community/actions"
import Alert from "@material-ui/lab/Alert"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import Link from "@material-ui/core/Link"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
	root: {
		flexDirection: "row",
	},
}))

export const LoginPage = () => {
	const classes = useStyles()

	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()
	const { login } = useCommunityService()
	const [{}, dispatch] = useCommunityStore()

	const usernameInput = useRef()
	const passwordInput = useRef()
	const [detail, setDetails] = useState("")

	const performLogin = (event) => {
		event.preventDefault()
		login(usernameInput.current.value, passwordInput.current.value).then(
			(response) => {
				passwordInput.current.value = ""
				response
					.json()
					.then((body) => {
						if (response.status === 200) {
							enqueueSnackbar("Sign in successful", { variant: "success" })
							dispatch({
								type: LOGIN,
								accessToken: body["access"],
								refreshToken: body["refresh"],
							})
							history.push("/")
						} else {
							if ("detail" in body) {
								setDetails(body["detail"])
							} else {
								setDetails("Unknown error occured")
							}
						}
					})
					.catch((ex) => setDetails("Unknown error occured"))
			}
		)
	}

	return (
		<ContentContainer title={"Sign in"} maxWidth="sm">
			{detail && <Alert severity="error">{detail}</Alert>}
			<form noValidate onSubmit={performLogin} action="#">
				<FormControl fullWidth margin="dense">
					<TextField id="username" label="Username" inputRef={usernameInput} />
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="password"
						type="password"
						label="Password"
						inputRef={passwordInput}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense" classes={{ root: classes.root }}>
					<Link to="/password-reset" variant="caption">
						Forgot your password?
					</Link>
					<Button
						type="submit"
						onClick={performLogin}
						variant="outlined"
						color="primary"
						style={{ marginLeft: "auto" }}
					>
						Login
					</Button>
				</FormControl>
			</form>
		</ContentContainer>
	)
}
