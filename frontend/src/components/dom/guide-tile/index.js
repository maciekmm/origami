import React from "react"
import GridListTile from "@material-ui/core/GridListTile"
import IconButton from "@material-ui/core/IconButton"
import { OpenInBrowser } from "@material-ui/icons"
import GridListTileBar from "@material-ui/core/GridListTileBar"

export const GuideTile = ({ guide, onClick, onOpen, ...other }) => {
	return (
		<GridListTile key={guide.id} cols={1} {...other}>
			<img src="https://i.pinimg.com/originals/62/12/50/621250c0dec2949856d926a69c1414e5.png" />
			<GridListTileBar
				title={guide.name}
				subtitle={<span>By: {guide["owner_username"]}</span>}
				actionIcon={
					<IconButton onClick={() => onOpen(guide)}>
						<OpenInBrowser style={{ color: "white" }} />
					</IconButton>
				}
			/>
		</GridListTile>
	)
}
