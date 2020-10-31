import React from "react"
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"
import { AccountCircle } from "@material-ui/icons"
import IconButton from "@material-ui/core/IconButton"
import { useCommunityStore } from "@store/community"
import { useHistory } from "react-router-dom"
import { Typography } from "@material-ui/core"
import { LOGOUT } from "@store/community/actions"
import { useSnackbar } from "notistack"

export const AccountDropdown = (props) => {
	const [{ username }, dispatch] = useCommunityStore()
	const [anchorEl, setAnchorEl] = React.useState(null)
	const history = useHistory()
	const { enqueueSnackbar } = useSnackbar()

	const isMenuOpen = Boolean(anchorEl)

	const menuId = "account-dropdown"

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const navigateTo = (path) => {
		handleMenuClose()
		history.push(path)
	}

	const logout = () => {
		dispatch({ type: LOGOUT })
		navigateTo("/")
		enqueueSnackbar("Logout successful", { variant: "success" })
	}

	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			{!username
				? [
						<MenuItem key="login" onClick={() => navigateTo("/login")}>
							Sign in
						</MenuItem>,
						<MenuItem key="register" onClick={() => navigateTo("/register")}>
							Sign up
						</MenuItem>,
				  ]
				: [
						<MenuItem key="settings" onClick={() => navigateTo("/settings")}>
							Settings
						</MenuItem>,
						<MenuItem key="logout" onClick={() => logout()}>
							Logout
						</MenuItem>,
				  ]}
		</Menu>
	)

	return (
		<>
			<IconButton
				aria-label="account of current user"
				aria-controls={menuId}
				aria-haspopup="true"
				onClick={handleProfileMenuOpen}
				color="inherit"
			>
				<Typography variant="button">
					{username !== null && username}
				</Typography>
				<AccountCircle />
			</IconButton>
			{renderMenu}
		</>
	)
}
