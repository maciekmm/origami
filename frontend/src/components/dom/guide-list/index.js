import { ContentContainer } from "@dom-components/content-container"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import GridList from "@material-ui/core/GridList"
import { GuideTile } from "@dom-components/guide-tile"
import React, { useState } from "react"

export const GuideList = ({ title, guides, openGuide, HeaderButton }) => {
	const [filteredGuides, setFilteredGuides] = useState(guides)
	const [searchCriteria, setSearchCriteria] = useState("")

	const onSearch = (event) => {
		const value = event.target.value
		setSearchCriteria(value)
		setFilteredGuides(
			guides.filter(
				(guide) => guide.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
			)
		)
	}

	return (
		<ContentContainer title={title}>
			<Grid
				container
				direction="row"
				justify="space-between"
				alignItems="center"
			>
				<TextField
					placeholder="Search..."
					margin="dense"
					InputLabelProps={{
						shrink: true,
					}}
					variant="outlined"
					onChange={onSearch}
					value={searchCriteria}
				/>
				{HeaderButton ? HeaderButton : null}
			</Grid>
			<GridList
				cellHeight={140}
				cols={4}
				spacing={10}
				style={{ marginTop: "1em" }}
			>
				{filteredGuides.map((guide) => (
					<GuideTile key={guide.id} guide={guide} onOpen={openGuide} />
				))}
			</GridList>
		</ContentContainer>
	)
}
