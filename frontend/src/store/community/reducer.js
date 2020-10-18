import { LOGIN, LOGOUT } from "@store/community/actions"
import { getEmail, getUsername } from "@store/community/selectors"

export const initialState = {
	tokens: {
		auth: window.localStorage.getItem("auth-token"),
		refresh: window.localStorage.getItem("refresh-token"),
	},
	username: null,
	email: null,
}

export function reducer(state, action) {
	switch (action.type) {
		case LOGIN:
			window.localStorage.setItem("auth-token", action.authToken)
			window.localStorage.setItem("refresh-token", action.refreshToken)

			const username = getUsername(action.authToken)
			const email = getEmail(action.refreshToken)

			return {
				...state,
				tokens: {
					auth: action.authToken,
					refresh: action.refreshToken,
				},
				username: username,
				email: email,
			}
		case LOGOUT:
			window.localStorage.removeItem("auth-token")
			window.localStorage.removeItem("refresh-token")
			return {
				...state,
				tokens: {
					auth: null,
					refresh: null,
				},
				email: null,
				username: null,
			}
	}
	return state
}
