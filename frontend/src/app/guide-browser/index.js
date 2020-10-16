import React, { useEffect, useState } from "react"
import { useCommunityService } from "../../services/community"
import { useCommunityStore } from "@store/community"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import GridListTileBar from "@material-ui/core/GridListTileBar"
import { Typography } from "@material-ui/core"
import Container from "@material-ui/core/Container"
import { makeStyles } from "@material-ui/core/styles"
import { OpenInBrowser } from "@material-ui/icons"
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles((theme) => ({
	root: {
		...theme.root,
		paddingTop: "1em",
	},
}))

export const GuideBrowser = (props) => {
	const { fetchGuides } = useCommunityService()
	const [{ tokens }] = useCommunityStore()
	const [guides, setGuides] = useState([])

	useEffect(() => {
		fetchGuides().then((guides) => {
			setGuides(guides)
		})
	}, [tokens])

	const classes = useStyles()

	return (
		<Container maxWidth="md" className={classes.root}>
			<Typography variant="h5">Guides</Typography>
			<GridList cellHeight={160} cols={3} spacing={15}>
				{guides.map((guide) => (
					<GridListTile key={guide.id} cols={1}>
						<img src="https://i.pinimg.com/originals/62/12/50/621250c0dec2949856d926a69c1414e5.png" />
						<GridListTileBar
							title={guide.name}
							subtitle={<span>By: {guide.owner}</span>}
							actionIcon={
								<IconButton>
									<OpenInBrowser style={{ color: "white" }} />
								</IconButton>
							}
						/>
					</GridListTile>
				))}
			</GridList>
		</Container>
	)
}
