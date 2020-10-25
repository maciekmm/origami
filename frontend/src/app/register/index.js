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

export const RegisterPage = () => {
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()
	const { register } = useCommunityService()

	const [detail, setDetails] = useState("")
	const [fieldErrors, setFieldErrors] = useState({})
	const usernameInput = useRef()
	const passwordInput = useRef()
	const emailInput = useRef()

	const performSignup = (event) => {
		event.preventDefault()
		register(
			usernameInput.current.value,
			emailInput.current.value,
			passwordInput.current.value
		).then((response) => {
			passwordInput.current.value = ""
			response
				.json()
				.then((body) => {
					if (response.status === 201) {
						enqueueSnackbar("Sign up successful", { variant: "success" })
						history.push("/login")
					} else {
						if ("detail" in body) {
							setDetails(body["detail"])
						} else {
							setFieldErrors(body)
						}
					}
				})
				.catch((ex) => {
					setDetails("Unknown error occured")
				})
		})
	}

	return (
		<ContentContainer title={"Sign up"} maxWidth="sm">
			{detail && <Alert severity="error">{detail}</Alert>}
			<form noValidate onSubmit={performSignup} action="#">
				<FormControl fullWidth margin="dense">
					<TextField
						id="username"
						label="Username"
						inputRef={usernameInput}
						error={"username" in fieldErrors}
						helperText={fieldErrors["username"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="email"
						label="Email"
						inputRef={emailInput}
						error={"email" in fieldErrors}
						helperText={fieldErrors["email"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="password"
						type="password"
						label="Password"
						inputRef={passwordInput}
						error={"password" in fieldErrors}
						helperText={fieldErrors["password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<Button
						type="submit"
						variant="outlined"
						color="primary"
						style={{ marginLeft: "auto" }}
					>
						Signup
					</Button>
				</FormControl>
			</form>
		</ContentContainer>
	)
}
