import { useSnackbar } from "notistack"
import { isExpired } from "../jwt"
import { useCallback } from "react"

const withJsonBodyIfUpdateAction = (requestOpts) => {
	const method =
		requestOpts && requestOpts.method ? requestOpts.method.toLowerCase() : "get"

	if (["post", "put", "patch"].indexOf(method) != -1) {
		if (!requestOpts) {
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

export const useHttp = () => {
	const { enqueueSnackbar } = useSnackbar()

	const withValidateResponse = useCallback(
		(response) =>
			response
				.then((response) => {
					const contentType = response.headers.get("content-type")
					if (contentType && !contentType.includes("/json")) {
						return Promise.reject(
							new TypeError(
								"Invalid contentType. Expected json, got " + contentType
							)
						)
					}

					if (!response.ok && !contentType) {
						return Promise.reject(
							new Error("Unexpected response: " + response.statusText)
						)
					}

					return response
				})
				.catch((exception) => {
					console.error(exception)
					enqueueSnackbar("Unknown error occurred")
				}),
		[] // eslint-disable-line react-hooks/exhaustive-deps
	) // enqueueSnackbar will change every time useSnackbar is called, therefore we can't depend on it

	const _fetch = useCallback(
		(url, requestOpts) =>
			withValidateResponse(fetch(url, withJsonBodyIfUpdateAction(requestOpts))),
		[withValidateResponse]
	)

	return {
		fetch: _fetch,
	}
}

const withAuthedOpts = (maybeToken, requestOpts) => {
	if (!requestOpts) {
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

export const useAuthedHttp = (tokens, tokenRefresher) => {
	const { fetch } = useHttp()

	const fetchAccessToken = useCallback(() => {
		if (!!tokens.access) {
			const expired = isExpired(tokens.access)
			if (expired) {
				return tokenRefresher(tokens.refresh).then((tokens) => tokens.access)
			} else {
				return Promise.resolve(tokens.access)
			}
		}
		return Promise.resolve(null)
	}, [tokens, tokenRefresher])

	const authedFetch = useCallback(
		(url, opts) =>
			fetchAccessToken().then((maybeToken) => {
				const authedOpts = withAuthedOpts(maybeToken, opts)
				return fetch(url, authedOpts)
			}),
		[fetch, fetchAccessToken]
	)

	return {
		fetch: authedFetch,
	}
}
