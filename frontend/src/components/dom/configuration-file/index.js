import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import { ConfigurationGroup } from "@dom-components/configuration-group"
import React from "react"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputAdornment from "@material-ui/core/InputAdornment"
import Button from "@material-ui/core/Button"

export default function FileConfiguration({
	author,
	title,
	description,
	onAuthorChange,
	onTitleChange,
	onDescriptionChange,
	onSave,
}) {
	return (
		<ConfigurationGroup title="File">
			<FormControl fullWidth margin="dense">
				<TextField
					id="configuration-file-author"
					label="Author"
					value={author}
					onChange={(event) => onAuthorChange(event.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</FormControl>
			<FormControl fullWidth margin="dense">
				<TextField
					id="configuration-file-title"
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
					id="configuration-file-description"
					label="Description"
					value={description}
					onChange={(event) => onDescriptionChange(event.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</FormControl>
			<Button color="primary" onClick={onSave}>
				Save
			</Button>
		</ConfigurationGroup>
	)
}
