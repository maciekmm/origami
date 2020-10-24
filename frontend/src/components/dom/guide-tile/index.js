import React from "react"
import GridListTile from "@material-ui/core/GridListTile"
import IconButton from "@material-ui/core/IconButton"
import {
	Favorite,
	FavoriteBorder,
	OpenInBrowser,
	PlayArrow,
} from "@material-ui/icons"
import GridListTileBar from "@material-ui/core/GridListTileBar"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-around",
		overflow: "hidden",
		backgroundColor: theme.palette.background.paper,
	},
	titleBar: {
		background:
			"linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, " +
			"rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)",
	},
	icon: {
		color: "white",
	},
	likedIcon: {
		color: theme.palette.secondary.dark,
	},
}))

export const GuideTile = ({ guide, onClick, onOpen, onLike, ...other }) => {
	const classes = useStyles()

	return (
		<GridListTile key={guide.id} cols={1} {...other}>
			<img src="https://i.pinimg.com/originals/62/12/50/621250c0dec2949856d926a69c1414e5.png" />
			<GridListTileBar
				className={classes.titleBar}
				titlePosition="top"
				// subtitle={<span>By: {guide["owner_username"]}</span>}
				actionIcon={
					<IconButton onClick={() => onLike(guide)}>
						{guide.liked ? (
							<Favorite className={classes.likedIcon}></Favorite>
						) : (
							<FavoriteBorder className={classes.icon}></FavoriteBorder>
						)}
					</IconButton>
				}
			/>
			<GridListTileBar
				title={guide.name}
				// subtitle={<span>By: {guide["owner_username"]}</span>}
				actionIcon={
					<IconButton onClick={() => onOpen(guide)}>
						<PlayArrow className={classes.icon} />
					</IconButton>
				}
			/>
		</GridListTile>
	)
}
