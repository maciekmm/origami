import React from "react"
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"
import { AccountCircle } from "@material-ui/icons"
import IconButton from "@material-ui/core/IconButton"
import { useCommunityStore } from "@store/community"

export const AccountDropdown = (props) => {
	const [{ username }, dispatch] = useCommunityStore()
	const [anchorEl, setAnchorEl] = React.useState(null)

	const isMenuOpen = Boolean(anchorEl)

	const menuId = "account-dropdown"

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
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
			<MenuItem onClick={handleMenuClose}>Sign in</MenuItem>
			<MenuItem onClick={handleMenuClose}>Sign up</MenuItem>
		</Menu>
	)

	return (
		<>
			<IconButton
				edge="end"
				aria-label="account of current user"
				aria-controls={menuId}
				aria-haspopup="true"
				onClick={handleProfileMenuOpen}
				color="inherit"
				style={{ marginLeft: "auto" }}
			>
				{username !== null && username}
				<AccountCircle />
			</IconButton>
			{renderMenu}
		</>
	)
}
