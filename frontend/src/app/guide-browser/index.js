import React, { useEffect, useState } from "react"
import { useCommunityService } from "../../services/community"
import { useCommunityStore } from "@store/community"
import GridList from "@material-ui/core/GridList"
import { ContentContainer } from "@dom-components/content-container"
import { useHistory } from "react-router-dom"
import { GuideTile } from "@dom-components/guide-tile"

export const GuideBrowser = (props) => {
	const { fetchGuides } = useCommunityService()
	const [{ tokens }] = useCommunityStore()
	const [guides, setGuides] = useState([])

	useEffect(() => {
		fetchGuides().then((guides) => {
			setGuides(guides)
		})
	}, [tokens])

	const history = useHistory()

	const openGuide = (guide) => {
		history.push("/view/" + guide.id)
	}

	return (
		<ContentContainer>
			<GridList cellHeight={160} cols={3} spacing={15}>
				{guides.map((guide) => (
					<GuideTile key={guide.id} guide={guide} onOpen={openGuide} />
				))}
			</GridList>
		</ContentContainer>
	)
}
