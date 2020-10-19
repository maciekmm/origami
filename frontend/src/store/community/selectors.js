import { decodeJWT } from "../../jwt"

export const getProperty = function (token, property) {
	if (!token) return null
	return decodeJWT(token)[property]
}
