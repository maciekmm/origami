import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import { ConfigurationGroup } from "@dom-components/configuration-group"
import React from "react"

export default function StepConfiguration({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
}) {
	return (
		<ConfigurationGroup title="Step">
			<FormControl fullWidth margin="dense">
				<TextField
					id="configuration-step-title"
					label="Title"
					value={title}
					onChange={(event) => onTitleChange(event.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</FormControl>
			<FormControl fullWidth margin="dense">
				<TextField
					id="configuration-step-description"
					label="Description"
					value={description}
					onChange={(event) => onDescriptionChange(event.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</FormControl>
		</ConfigurationGroup>
	)
}
