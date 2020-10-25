import { useSnackbar } from "notistack"

const withJsonBodyIfUpdateAction = (requestOpts) => {
	const method =
		requestOpts && requestOpts.method ? requestOpts.method.toLowerCase() : "get"

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

import { isExpired } from "../jwt"
import { useMemo } from "react"

export const useHttp = () => {
	const { enqueueSnackbar } = useSnackbar()

	const withValidateResponse = useMemo(
		() => (response) =>
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
				}),
		[enqueueSnackbar]
	)

	const _fetch = useMemo(
		() => (url, requestOpts) =>
			withValidateResponse(fetch(url, withJsonBodyIfUpdateAction(requestOpts))),
		[withJsonBodyIfUpdateAction]
	)

	return {
		fetch: _fetch,
	}
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

export const useAuthedHttp = (tokens, tokenRefresher) => {
	const { fetch } = useHttp()

	const fetchAccessToken = useMemo(
		() => () => {
			if (!!tokens.access) {
				const expired = isExpired(tokens.access)
				if (expired) {
					return tokenRefresher(tokens.refresh).then((tokens) => tokens.access)
				} else {
					return Promise.resolve(tokens.access)
				}
			}
			return Promise.resolve(null)
		},
		[tokens, tokenRefresher]
	)

	const authedFetch = useMemo(
		() => (url, opts) =>
			fetchAccessToken().then((maybeToken) => {
				const authedOpts = withAuthedOpts(maybeToken, opts)
				return fetch(url, authedOpts)
			}),
		[withAuthedOpts, fetch]
	)

	return {
		fetch: authedFetch,
	}
}
