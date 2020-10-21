import { LOGIN, LOGOUT } from "@store/community/actions"
import { getProperty } from "@store/community/selectors"

export const initialState = {
	tokens: {
		access: window.localStorage.getItem("access-token"),
		refresh: window.localStorage.getItem("refresh-token"),
	},
}

initialState.username = getProperty(initialState.tokens.access, "username")
initialState.email = getProperty(initialState.tokens.access, "email")
initialState.userId = getProperty(initialState.tokens.access, "user_id")

export function reducer(state, action) {
	switch (action.type) {
		case LOGIN:
			window.localStorage.setItem("access-token", action.accessToken)
			window.localStorage.setItem("refresh-token", action.refreshToken)

			const username = getProperty(action.accessToken, "username")
			const email = getProperty(action.refreshToken, "email")
			const userId = getProperty(action.refreshToken, "user_id")

			return {
				...state,
				tokens: {
					access: action.accessToken,
					refresh: action.refreshToken,
				},
				email: email,
				username: username,
				userId: userId,
			}
		case LOGOUT:
			window.localStorage.removeItem("access-token")
			window.localStorage.removeItem("refresh-token")
			return {
				...state,
				tokens: {
					access: null,
					refresh: null,
				},
				email: null,
				username: null,
				userId: null,
			}
	}
	return state
}
