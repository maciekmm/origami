import { useSnackbar } from "notistack"
import { isExpired } from "../jwt"

export const useHttp = () => {
	const { enqueueSnackbar } = useSnackbar()

	const withValidateResponse = (response) =>
		response
			.then((response) => {
				const contentType = response.headers.get("content-type")
				if (contentType && !contentType.includes("/json")) {
					throw new TypeError(
						"Invalid contentType. Expected json, got " + contentType
					)
				}

				if (!response.ok && !contentType) {
					throw new Error("Unexpected response: " + response.statusText)
				}

				return response
			})
			.catch((exception) => {
				console.error(exception)
				enqueueSnackbar("Unknown error occurred")
			})

	const withJsonBodyIfUpdateAction = (requestOpts) => {
		const method =
			requestOpts && requestOpts.method
				? requestOpts.method.toLowerCase()
				: "get"

		if (["post", "put", "patch"].indexOf(method) != -1) {
			if (requestOpts === undefined) {
				requestOpts = {}
			}
			return {
				...requestOpts,
				headers: {
					...(requestOpts.headers || {}),
					"Content-Type": "application/json",
				},
			}
		}
		return requestOpts
	}

	const _fetch = (url, requestOpts) =>
		withValidateResponse(fetch(url, withJsonBodyIfUpdateAction(requestOpts)))

	return {
		fetch: _fetch,
	}
}

export const useAuthedHttp = (tokens, tokenRefresher) => {
	const { fetch } = useHttp()

	const fetchAccessToken = function () {
		if (!!tokens.access) {
			const expired = isExpired(tokens.access)
			if (expired) {
				return tokenRefresher(tokens.refresh).then((tokens) => tokens.access)
			} else {
				return Promise.resolve(tokens.access)
			}
		}
		return Promise.resolve(null)
	}

	const withAuthedOpts = (maybeToken, requestOpts) => {
		if (requestOpts === undefined) {
			requestOpts = {}
		}
		if (!!maybeToken) {
			return {
				...requestOpts,
				headers: {
					...(requestOpts.headers || {}),
					Authorization: "Bearer " + maybeToken,
				},
			}
		}
		return requestOpts
	}

	const authedFetch = (url, opts) =>
		fetchAccessToken().then((maybeToken) => {
			const authedOpts = withAuthedOpts(maybeToken, opts)
			return fetch(url, authedOpts)
		})

	return {
		fetch: authedFetch,
	}
}
