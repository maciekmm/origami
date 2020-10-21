import React, { useEffect, useState } from "react"
import { useCommunityService } from "../../services/community"
import { useCommunityStore } from "@store/community"
import { useHistory } from "react-router-dom"
import { GuideList } from "@dom-components/guide-list"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

export const GuideBrowser = (props) => {
	const { fetchGuides } = useCommunityService()
	const [{ userId }] = useCommunityStore()

	const [userGuides, setUserGuides] = useState([])
	const [allGuides, setAllGuides] = useState([])

	useEffect(() => {
		if (userId === null) {
			setUserGuides([])
			return
		}
		fetchGuides({
			owner: userId,
		})
			.then((response) => response.json())
			.then((guides) => setUserGuides(guides))
	}, [userId, fetchGuides])

	useEffect(() => {
		fetchGuides()
			.then((response) => response.json())
			.then((guides) => setAllGuides(guides))
	}, [fetchGuides])

	const history = useHistory()

	const openGuide = (guide) => history.push("/view/" + guide.id)

	const uploadGuide = () => history.push("/upload")

	return (
		<>
			{userGuides.length > 0 && (
				<GuideList
					title="My guides"
					openGuide={openGuide}
					guides={userGuides}
					HeaderButton={
						<Button
							variant="contained"
							color="primary"
							onClick={uploadGuide}
							disableElevation
						>
							Upload
						</Button>
					}
				></GuideList>
			)}
			{allGuides.length > 0 && (
				<GuideList
					title="All guides"
					openGuide={openGuide}
					guides={allGuides}
				></GuideList>
			)}
		</>
	)
}
