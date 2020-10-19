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
		fetchGuides()
			.then((response) => response.json())
			.then((guides) => setGuides(guides))
	}, [tokens, fetchGuides])

	const history = useHistory()

	const openGuide = (guide) => {
		history.push("/view/" + guide.id)
	}

	return (
		<ContentContainer title="Guides">
			<GridList cellHeight={140} cols={4} spacing={10}>
				{guides.map((guide) => (
					<GuideTile key={guide.id} guide={guide} onOpen={openGuide} />
				))}
			</GridList>
		</ContentContainer>
	)
}
