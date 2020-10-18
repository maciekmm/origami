import { decodeJWT } from "../../jwt"

export const getUsername = function (token) {
	return decodeJWT(token)["username"]
}

export const getEmail = function (token) {
	return decodeJWT(token)["email"]
}
