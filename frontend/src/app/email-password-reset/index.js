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

export const EmailPasswordReset = () => {
	const { emailPasswordReset } = useCommunityService()

	const [detail, setDetails] = useState({ message: "", severity: "" })
	const [fieldErrors, setFieldErrors] = useState({})
	const emailInput = useRef()

	const resetPassword = (event) => {
		event.preventDefault()
		setDetails({})
		setFieldErrors({})
		emailPasswordReset(emailInput.current.value).then((response) => {
			response
				.json()
				.then((body) => {
					if (response.ok) {
						setDetails({
							message: "Follow instructions sent to Your email address.",
							severity: "success",
						})
					} else {
						if ("detail" in body) {
							setDetails({ message: body["detail"], severity: "error" })
						} else {
							setFieldErrors(body)
						}
					}
				})
				.catch((ex) => {
					setDetails({ message: "Unknown error occured", severity: "error" })
				})
		})
	}

	return (
		<ContentContainer title={"Reset password"} maxWidth="sm">
			{detail.message && (
				<Alert severity={detail.severity}>{detail.message}</Alert>
			)}
			<form noValidate onSubmit={resetPassword} action="#">
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
					<Button
						type="submit"
						variant="outlined"
						color="primary"
						style={{ marginLeft: "auto" }}
					>
						Reset password
					</Button>
				</FormControl>
			</form>
		</ContentContainer>
	)
}
