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

export const SettingsPage = () => {
	const { changePassword } = useCommunityService()
	const currentPasswordInput = useRef()
	const newPasswordInput = useRef()
	const confirmPasswordInput = useRef()
	const [detail, setDetails] = useState("")
	const [fieldErrors, setFieldErrors] = useState({})
	const { enqueueSnackbar } = useSnackbar()

	const clearFields = () => {
		currentPasswordInput.current.value = ""
		newPasswordInput.current.value = ""
		confirmPasswordInput.current.value = ""
	}

	const performLogin = (event) => {
		event.preventDefault()
		const newPassword = newPasswordInput.current.value
		const newPasswordConfirm = confirmPasswordInput.current.value
		if (newPassword !== newPasswordConfirm) {
			setFieldErrors({
				confirm_password: "Passwords do not match",
			})
			return
		}

		if (!newPassword) {
			setFieldErrors({
				new_password: "New password cannot be empty",
			})
			return
		}

		changePassword(currentPasswordInput.current.value, newPassword).then(
			(response) => {
				response
					.json()
					.then((body) => {
						if (response.ok) {
							clearFields()
							enqueueSnackbar("Password change successful", {
								variant: "success",
							})
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
			}
		)
	}

	return (
		<ContentContainer title={"Change Password"} maxWidth="sm">
			{detail && <Alert severity="error">{detail}</Alert>}
			<form noValidate onSubmit={performLogin} action="#">
				<FormControl fullWidth margin="dense">
					<TextField
						id="current-password"
						type="password"
						label="Current Password"
						inputRef={currentPasswordInput}
						error={"current_password" in fieldErrors}
						helperText={fieldErrors["current_password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="new-password"
						type="password"
						label="New Password"
						inputRef={newPasswordInput}
						error={"new_password" in fieldErrors}
						helperText={fieldErrors["new_password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="confirm-password"
						type="password"
						label="Confirm New Password"
						inputRef={confirmPasswordInput}
						error={"confirm_password" in fieldErrors}
						helperText={fieldErrors["confirm_password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<Button
						type="submit"
						onClick={performLogin}
						variant="outlined"
						color="primary"
						style={{ marginLeft: "auto" }}
					>
						Save
					</Button>
				</FormControl>
			</form>
		</ContentContainer>
	)
}
