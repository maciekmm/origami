import React from "react"
import GridListTile from "@material-ui/core/GridListTile"
import IconButton from "@material-ui/core/IconButton"
import Favorite from "@material-ui/icons/Favorite"
import FavoriteBorder from "@material-ui/icons/FavoriteBorder"
import PlayArrow from "@material-ui/icons/PlayArrow"
import Edit from "@material-ui/icons/Edit"
import Delete from "@material-ui/icons/Delete"
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
	tile: {
		cursor: "pointer",
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

export const GuideTile = ({
	guide,
	onOpen,
	onEdit,
	onDelete,
	onLike,
	showOwnerActions,
	...other
}) => {
	const classes = useStyles()

	return (
		<GridListTile
			classes={{ root: classes.tile }}
			key={guide.id}
			cols={1}
			{...other}
			onClick={() => onOpen(guide)}
		>
			<img src={guide.thumbnail_file} />
			<GridListTileBar
				className={classes.titleBar}
				titlePosition="top"
				// subtitle={<span>By: {guide["owner_username"]}</span>}
				actionIcon={
					<IconButton
						onClick={(event) => {
							event.stopPropagation()
							onLike(guide)
						}}
					>
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
					showOwnerActions && (
						<>
							<IconButton
								onClick={(event) => {
									event.stopPropagation()
									onEdit(guide.id)
								}}
							>
								<Edit className={classes.icon} />
							</IconButton>
							<IconButton
								onClick={(event) => {
									event.stopPropagation()
									onDelete(guide.id)
								}}
							>
								<Delete className={classes.icon} />
							</IconButton>
						</>
					)
				}
			/>
		</GridListTile>
	)
}
