import { Link } from "react-router-dom"
import Button from "@material-ui/core/Button"
import React from "react"

export default function ButtonLink({ title, ...props }) {
	return (
		<Link {...props}>
			<Button style={{ color: "#fff" }}>{title}</Button>
		</Link>
	)
}
