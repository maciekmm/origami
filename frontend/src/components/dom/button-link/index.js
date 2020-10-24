import { Link } from "react-router-dom"
import Button from "@material-ui/core/Button"
import React from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles((theme) => ({
	root: {
		color: theme.palette.secondary.contrastText,
		"&:active": {
			textDecoration: "underline",
		},
	},
}))
export default function ButtonLink({ title, to, ...props }) {
	const classes = useStyles()

	return (
		<Button
			component={Link}
			to={to}
			classes={{ root: classes.root }}
			{...props}
		>
			{title}
		</Button>
	)
}
