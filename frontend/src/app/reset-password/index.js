import React, { useRef, useState } from "react"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { ContentContainer } from "@dom-components/content-container"
import FormControl from "@material-ui/core/FormControl"
import { useCommunityService } from "../../services/community"
import Alert from "@material-ui/lab/Alert"
import { useParams } from "react-router-dom"
import { useSnackbar } from "notistack"

export const ResetPassword = () => {
	const { enqueueSnackbar } = useSnackbar()
	const { token } = useParams()

	const { resetPassword } = useCommunityService()

	const [detail, setDetails] = useState("")
	const [fieldErrors, setFieldErrors] = useState({})
	const newPasswordInput = useRef()
	const confirmPasswordInput = useRef()

	const clearFields = () => {
		newPasswordInput.current.value = ""
		confirmPasswordInput.current.value = ""
		setFieldErrors({})
	}

	const changePassword = (event) => {
		event.preventDefault()
		const newPassword = newPasswordInput.current.value
		const newPasswordConfirm = confirmPasswordInput.current.value
		clearFields()
		if (newPassword !== newPasswordConfirm) {
			setDetails("Passwords do not match")
			return
		}

		if (!newPassword) {
			setFieldErrors({
				new_password: "New password cannot be empty",
			})
			return
		}

		resetPassword(newPassword, token).then((response) => {
			response
				.json()
				.then((body) => {
					if (response.ok) {
						enqueueSnackbar("Password changed successfully", {
							variant: "success",
						})
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
		<ContentContainer title={"Change password"} maxWidth="sm">
			{detail && <Alert severity="error">{detail}</Alert>}
			<form noValidate onSubmit={changePassword} action="#">
				<FormControl fullWidth margin="dense">
					<TextField
						id="new-password"
						type="password"
						label="New password"
						inputRef={newPasswordInput}
						error={"password" in fieldErrors}
						helperText={fieldErrors["password"] || ""}
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
						variant="outlined"
						color="primary"
						style={{ marginLeft: "auto" }}
					>
						Change Password
					</Button>
				</FormControl>
			</form>
		</ContentContainer>
	)
}
