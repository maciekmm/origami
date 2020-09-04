import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import { ConfigurationGroup } from "@dom-components/configuration-group"
import React from "react"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputAdornment from "@material-ui/core/InputAdornment"

const EDGE_ASSIGNMENTS = {
	V: "Valley",
	M: "Mountain",
	F: "Flat",
	B: "Boundry",
}

export default function EdgeConfiguration({
	assignment,
	onAssignmentChange,
	targetAngle,
	onTargetAngleChange,
}) {
	return (
		<ConfigurationGroup title="Edge" defaultExpanded>
			<FormControl fullWidth margin="dense">
				<InputLabel id="configuration-edge-assignment" shrink>
					Assignment
				</InputLabel>
				<Select
					labelId="configuration-edge-assignment"
					id="configuration-edge-assignment"
					value={assignment}
					onChange={(event) => onAssignmentChange(event.target.value)}
				>
					{Object.keys(EDGE_ASSIGNMENTS).map((assignment) => {
						return (
							<MenuItem key={assignment} value={assignment}>
								{EDGE_ASSIGNMENTS[assignment]}
							</MenuItem>
						)
					})}
				</Select>
			</FormControl>
			<FormControl fullWidth margin="dense">
				<TextField
					id="configuration-edge-target-angle"
					label="Target Angle"
					type="number"
					value={targetAngle}
					onChange={(event) => onTargetAngleChange(event.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
					InputProps={{
						endAdornment: <InputAdornment position="end">°</InputAdornment>,
					}}
					inputProps={{
						min: -360,
						max: 360,
					}}
				/>
			</FormControl>
		</ConfigurationGroup>
	)
}
