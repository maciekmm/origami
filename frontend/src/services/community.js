import { useCommunityStore } from "@store/community"
import { useMemo, useRef } from "react"
import { useSnackbar } from "notistack"

const BACKEND_URL = "http://localhost:8000/api"

const paramsToQueryString = (params) => {
	let query = "?"
	for (let key in params) {
		query += key + "=" + params[key]
	}
	return query
}

export const useCommunityService = () => {
	const [{ tokens, userId }, dispatch] = useCommunityStore()
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const validateResponse = useMemo(() => {
		return (response) =>
			response
				.then((response) => {
					const contentType = response.headers.get("content-type")
					if (!contentType || !contentType.includes("/json")) {
						throw new TypeError(
							"Invalid contentType. Expected json, got " + contentType
						)
					}
					return response
				})
				.catch((exception) => {
					console.error(exception)
					enqueueSnackbar("Error fetching data")
				})
	}, [])

	const statelessActions = useMemo(() => {
		return {
			login: (username, password) =>
				validateResponse(
					fetch(BACKEND_URL + "/token/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							username: username,
							password: password,
						}),
					})
				),

			register: (username, email, password) =>
				validateResponse(
					fetch(BACKEND_URL + "/users/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json;charset=utf-8",
						},
						body: JSON.stringify({
							username: username,
							email: email,
							password: password,
						}),
					})
				),
		}
	}, [])

	const statefulActions = useMemo(() => {
		const withAuth = function (requestOpts) {
			if (!!tokens.access) {
				return (requestOpts.headers = {
					...(requestOpts.headers || {}),
					Authorization: "Bearer " + tokens.access,
				})
			}
			return requestOpts
		}

		return {
			fetchGuides: (filters) =>
				validateResponse(
					fetch(
						BACKEND_URL + "/guides/" + paramsToQueryString(filters),
						withAuth({})
					)
				),

			fetchGuide: (guideId) =>
				validateResponse(
					fetch(BACKEND_URL + "/guides/" + guideId + "/", withAuth({}))
				),
		}
	}, [userId])

	return {
		...statelessActions,
		...statefulActions,
	}
}
