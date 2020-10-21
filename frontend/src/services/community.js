import { useCommunityStore } from "@store/community"
import { useMemo, useReducer } from "react"
import { useAuthedHttp, useHttp } from "./http"
import { LOGIN } from "@store/community/actions"

const BACKEND_URL = "http://localhost:8000/api"

const paramsToQueryString = (params) => {
	let query = "?"
	for (let key in params) {
		if (params[key] !== null) {
			query += key + "=" + params[key]
		}
	}
	return query
}

export const useTokenRefresher = (storeTokens) => {
	const { fetch } = useHttp()

	return (refreshToken) =>
		fetch(BACKEND_URL + "/token/refresh/", {
			method: "POST",
			body: JSON.stringify({
				refresh: refreshToken,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					console.warn(response)
					throw "Invalid response received"
				}
				return response.json()
			})
			.then((tokens) => {
				storeTokens({
					accessToken: tokens["access"],
					refreshToken: refreshToken,
				})
				return Promise.resolve(tokens.access)
			})
}

export const useCommunityService = () => {
	const [{ tokens, userId }, dispatch] = useCommunityStore()
	const tokenRefresher = useTokenRefresher((tokens) =>
		dispatch({ type: LOGIN, ...tokens })
	)
	const { fetch } = useAuthedHttp(tokens, tokenRefresher)

	const statelessActions = useMemo(() => {
		return {
			login: (username, password) =>
				fetch(BACKEND_URL + "/token/", {
					method: "POST",
					body: JSON.stringify({
						username: username,
						password: password,
					}),
				}),

			register: (username, email, password) =>
				fetch(BACKEND_URL + "/users/", {
					method: "POST",
					body: JSON.stringify({
						username: username,
						email: email,
						password: password,
					}),
				}),
		}
	}, [])

	const [invalidatorDependency, _invalidateFetchAction] = useReducer(
		(state) => state + 1,
		0
	)

	const withInvalidateFetchActions = (response) =>
		response.then((response) => {
			if (response.ok === true) {
				_invalidateFetchAction()
			}
			return response
		})

	const statefulActions = useMemo(() => {
		return {
			fetchGuides: (filters) =>
				fetch(BACKEND_URL + "/guides/" + paramsToQueryString(filters)),

			fetchGuide: (guideId) => fetch(BACKEND_URL + "/guides/" + guideId + "/"),

			likeGuide: (guideId) =>
				withInvalidateFetchActions(
					fetch(BACKEND_URL + "/guides/" + guideId + "/like/", {
						method: "POST",
					})
				),

			unlikeGuide: (guideId) =>
				withInvalidateFetchActions(
					fetch(BACKEND_URL + "/guides/" + guideId + "/like/", {
						method: "DELETE",
					})
				),
		}
	}, [userId, invalidatorDependency])

	return {
		...statelessActions,
		...statefulActions,
	}
}
