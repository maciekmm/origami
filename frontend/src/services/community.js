import { useCommunityStore } from "@store/community"
import { useMemo, useReducer } from "react"
import { useAuthedHttp, useHttp } from "./http"
import { LOGIN, LOGOUT } from "@store/community/actions"

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

const useTokenRefresher = (storeTokens, logout) => {
	const { fetch } = useHttp()

	return (refreshToken) =>
		fetch(BACKEND_URL + "/token/refresh/", {
			method: "POST",
			body: JSON.stringify({
				refresh: refreshToken,
			}),
		})
			.then((response) => {
				if (response.status === 401) {
					logout()
					return Promise.reject(new Error("Session expired"))
				}
				if (!response.ok) {
					console.warn(response)
					return Promise.reject(new Error("Unknown error"))
				}
				return response.json()
			})
			.then((tokens) => {
				storeTokens({
					accessToken: tokens["access"],
					refreshToken: refreshToken,
				})
				return Promise.resolve(tokens)
			})
}

export const useCommunityService = () => {
	const [{ tokens, userId }, dispatch] = useCommunityStore()
	const tokenRefresher = useTokenRefresher(
		(tokens) => dispatch({ type: LOGIN, ...tokens }),
		() => dispatch({ type: LOGOUT })
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

	const withInvalidateFetchActions = (request) =>
		request.then((response) => {
			if (response.ok) {
				_invalidateFetchAction()
			}
			return response
		})

	const statefulActions = useMemo(() => {
		return {
			fetchGuides: (filters) =>
				fetch(BACKEND_URL + "/guides/" + paramsToQueryString(filters)),

			fetchGuide: (guideId) => fetch(BACKEND_URL + "/guides/" + guideId + "/"),

			createGuide: (file, isPrivate, name, thumbnail) =>
				withInvalidateFetchActions(
					fetch(BACKEND_URL + "/guides/", {
						method: "POST",
						body: JSON.stringify({
							name: name,
							private: isPrivate,
							guide_file: file,
							thumbnail_file: thumbnail,
						}),
					})
				),

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

			changePassword: (oldPassword, newPassword) =>
				fetch(BACKEND_URL + "/users/" + userId + "/change_password/", {
					method: "PUT",
					body: JSON.stringify({
						old_password: oldPassword,
						new_password: newPassword,
					}),
				}),
		}
	}, [userId, invalidatorDependency])

	return {
		...statelessActions,
		...statefulActions,
	}
}
