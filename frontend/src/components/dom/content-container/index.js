import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import { Typography } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	root: {
		...theme.root,
		paddingTop: "1em",
	},
}))

export const ContentContainer = ({ children, title, maxWidth }) => {
	const classes = useStyles()

	return (
		<Container maxWidth={maxWidth ? maxWidth : "md"} className={classes.root}>
			{title && (
				<Typography variant="h5" color="primary">
					{title}
				</Typography>
			)}
			{children}
		</Container>
	)
}
