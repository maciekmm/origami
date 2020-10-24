import React, { useEffect, useState } from "react"
import { useCommunityService } from "../../services/community"
import { useCommunityStore } from "@store/community"
import { useHistory } from "react-router-dom"
import { GuideList } from "@dom-components/guide-list"
import Button from "@material-ui/core/Button"
import { useSnackbar } from "notistack"
import { LOAD_MODEL } from "@store/viewer/actions"
import ModelLoader from "@dom-components/model-loader"
import { ContentContainer } from "@dom-components/content-container"
import { useCreatorStore } from "@store/creator"

export const GuideBrowser = (props) => {
	const { fetchGuides, likeGuide, unlikeGuide } = useCommunityService()
	const [{ userId }] = useCommunityStore()
	const [{}, dispatchCreator] = useCreatorStore()

	const [userGuides, setUserGuides] = useState([])
	const [allGuides, setAllGuides] = useState([])
	const { enqueueSnackbar } = useSnackbar()

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

	const toggleLikeGuide = (guide) => {
		if (userId === null) {
			history.push("/login")
			enqueueSnackbar("Sign In to make that action", { variant: "info" })
			return
		}

		let action = guide.liked ? unlikeGuide(guide.id) : likeGuide(guide.id)
	}

	const loadGuide = (guide) => {
		dispatchCreator({ type: LOAD_MODEL, model: guide })
		history.push("/create")
	}

	return (
		<>
			{allGuides.length > 0 && (
				<GuideList
					title="All guides"
					openGuide={openGuide}
					guides={allGuides}
					toggleLikeGuide={toggleLikeGuide}
				></GuideList>
			)}
			{userGuides.length > 0 && (
				<GuideList
					title="My guides"
					openGuide={openGuide}
					guides={userGuides}
					HeaderButton={
						<ModelLoader
							component={
								<Button
									component="div"
									variant="contained"
									color="primary"
									disableElevation
								>
									Upload
								</Button>
							}
							loadModel={loadGuide}
						/>
					}
					toggleLikeGuide={toggleLikeGuide}
				></GuideList>
			)}
		</>
	)
}
