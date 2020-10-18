import { useCommunityStore } from "@store/community"

const BACKEND_URL = "http://localhost:8000/api"

export const useCommunityService = () => {
	const [tokens, dispatch] = useCommunityStore()

	const { auth } = tokens

	const withAuth = function (requestOpts) {
		if (!!auth) {
			return (opts.headers = {
				...(requestOpts.headers || {}),
				Authorization: "Bearer " + auth,
			})
		}
		return requestOpts
	}

	const asJson = (response) => response.then((body) => body.json())

	const login = (username, password) =>
		fetch(BACKEND_URL + "/token/", {
			method: "POST",
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})

	const register = (username, email, password) =>
		fetch(BACKEND_URL + "/users/", {
			method: "POST",
			body: JSON.stringify({
				username: username,
				email: email,
				password: password,
			}),
		})

	const fetchGuides = () =>
		asJson(
			fetch(
				BACKEND_URL + "/guides/",
				withAuth({
					method: "GET",
				})
			)
		)

	const fetchGuide = (guideId) => {
		return asJson(fetch(BACKEND_URL + "/guides/" + guideId, withAuth({})))
	}

	return {
		login: login,
		register: register,
		fetchGuides: fetchGuides,
		fetchGuide: fetchGuide,
	}
}
