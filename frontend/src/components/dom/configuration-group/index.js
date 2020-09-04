import React from "react"
import Typography from "@material-ui/core/Typography"
import MuiAccordion from "@material-ui/core/Accordion"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import { withStyles } from "@material-ui/core/styles"

const Accordion = withStyles({
	root: {
		border: "1px solid rgba(0, 0, 0, .125)",
		boxShadow: "none",
		"&:not(:last-child)": {
			borderBottom: 0,
		},
		"&:before": {
			display: "none",
		},
		"&$expanded": {
			margin: "auto",
		},
	},
	expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
	root: {
		backgroundColor: "rgba(0, 0, 0, .03)",
		borderBottom: "1px solid rgba(0, 0, 0, .125)",
		marginBottom: -1,
		minHeight: 56,
		"&$expanded": {
			minHeight: 56,
		},
	},
	content: {
		"&$expanded": {
			margin: "12px 0",
		},
	},
	expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
		flexDirection: "column",
		display: "flex",
	},
}))(MuiAccordionDetails)

export function ConfigurationGroup({ title, children, ...props }) {
	return (
		<Accordion square {...props}>
			<AccordionSummary>
				<Typography>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails>{children}</AccordionDetails>
		</Accordion>
	)
}
