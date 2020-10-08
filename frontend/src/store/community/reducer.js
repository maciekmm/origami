import { LOGIN, LOGOUT } from "@store/community/actions"

export const initialState = {
	tokens: {
		auth: window.localStorage.getItem("auth-token"),
		refresh: window.localStorage.getItem("refresh-token"),
	},
}

export function reducer(state, action) {
	switch (action.type) {
		case LOGIN:
			window.localStorage.setItem("auth-token", action.authToken)
			window.localStorage.setItem("refresh-token", action.refreshToken)

			return {
				...state,
				tokens: {
					auth: action.authToken,
					refresh: action.refreshToken,
				},
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
			}
	}
	return state
}
