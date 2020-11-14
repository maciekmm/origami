import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import { ConfigurationGroup } from "@dom-components/configuration-group"
import React from "react"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

export default function FileConfiguration({
	author,
	title,
	description,
	onAuthorChange,
	onTitleChange,
	onDescriptionChange,
	onPrivateChange,
	isPrivate,
	showPrivate,
	children,
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
			{showPrivate && (
				<FormControl fullWidth margin="dense">
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								id="configuration-file-private"
								onChange={(event) => onPrivateChange(event.target.checked)}
								name="guide-private"
								checked={isPrivate}
							/>
						}
						label="Private"
						color="primary"
					/>
				</FormControl>
			)}
			{children}
		</ConfigurationGroup>
	)
}
