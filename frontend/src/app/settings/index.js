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
	const { enqueueSnackbar } = useSnackbar()

	const [detail, setDetails] = useState("")
	const [fieldErrors, setFieldErrors] = useState({})
	const currentPasswordInput = useRef()
	const newPasswordInput = useRef()
	const confirmPasswordInput = useRef()

	const clearFields = () => {
		currentPasswordInput.current.value = ""
		newPasswordInput.current.value = ""
		confirmPasswordInput.current.value = ""
		setFieldErrors({})
	}

	const saveSettings = (event) => {
		event.preventDefault()
		const currentPassword = currentPasswordInput.current.value
		const newPassword = newPasswordInput.current.value
		const newPasswordConfirm = confirmPasswordInput.current.value
		clearFields()
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

		changePassword(currentPassword, newPassword)
			.then((response) =>
				response.json().then((body) => {
					if (response.ok) {
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
			)
			.catch((_) => {
				setDetails("Unknown error occured")
			})
	}

	return (
		<ContentContainer title={"Change Password"} maxWidth="sm">
			{detail && <Alert severity="error">{detail}</Alert>}
			<form noValidate onSubmit={saveSettings} action="#">
				<FormControl fullWidth margin="dense">
					<TextField
						id="current-password"
						type="password"
						label="Current Password"
						inputRef={currentPasswordInput}
						error={"old_password" in fieldErrors}
						helperText={fieldErrors["old_password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="new-password"
						type="password"
						label="New password"
						inputRef={newPasswordInput}
						error={"new_password" in fieldErrors}
						helperText={fieldErrors["new_password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<TextField
						id="confirm-password"
						type="password"
						label="Confirm new password"
						inputRef={confirmPasswordInput}
						error={"confirm_password" in fieldErrors}
						helperText={fieldErrors["confirm_password"] || ""}
					/>
				</FormControl>
				<FormControl fullWidth margin="dense">
					<Button
						type="submit"
						onClick={saveSettings}
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
