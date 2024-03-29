import { ContentContainer } from "@dom-components/content-container"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import GridList from "@material-ui/core/GridList"
import { GuideTile } from "@dom-components/guide-tile"
import React, { useEffect, useState } from "react"
import Pagination from "@material-ui/lab/Pagination"
import { makeStyles } from "@material-ui/core/styles"

const ROWS_PER_PAGE = 2
const COLUMNS = 3
const GUIDES_PER_PAGE = ROWS_PER_PAGE * COLUMNS

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: "1em",
	},
}))

export const GuideList = ({
	title,
	guides,
	openGuide,
	editGuide,
	deleteGuide,
	showEdit,
	toggleLikeGuide,
	HeaderButton,
}) => {
	const classes = useStyles()
	const [filteredGuides, setFilteredGuides] = useState(guides)
	const [paginatedGuides, setPaginatedGuides] = useState([])
	const [searchCriteria, setSearchCriteria] = useState("")
	const [page, setPage] = useState(1)
	const pages = Math.ceil((filteredGuides.length * 1.0) / GUIDES_PER_PAGE)

	const onSearch = (event) => {
		const value = event.target.value
		setSearchCriteria(value)
	}

	const changePage = (event, page) => setPage(page)

	useEffect(() => {
		const searchFilter = (guide) => {
			if (searchCriteria.length === 0) return true
			return (
				guide.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) !== -1
			)
		}

		setFilteredGuides(guides.filter(searchFilter))
	}, [searchCriteria, guides])

	useEffect(() => {
		setPaginatedGuides(
			filteredGuides.slice((page - 1) * GUIDES_PER_PAGE, page * GUIDES_PER_PAGE)
		)
	}, [page, filteredGuides])

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
				cellHeight={200}
				cols={COLUMNS}
				spacing={10}
				classes={{ root: classes.root }}
			>
				{paginatedGuides.map((guide) => (
					<GuideTile
						key={guide.id}
						guide={guide}
						onLike={toggleLikeGuide}
						showOwnerActions={showEdit}
						onOpen={openGuide}
						onEdit={editGuide}
						onDelete={deleteGuide}
					/>
				))}
			</GridList>
			<Grid
				container
				alignItems="center"
				justify="center"
				classes={{ root: classes.root }}
			>
				<Pagination count={pages} onChange={changePage} value={page} />
			</Grid>
		</ContentContainer>
	)
}
