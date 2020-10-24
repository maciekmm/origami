export function decodeJWT(token) {
	const base64Url = token.split(".")[1]
	const base64 = base64Url.replace("-", "+").replace("_", "/")
	return JSON.parse(window.atob(base64))
}

const CONSIDER_EXPIRED_OFFSET = 10

export function isExpired(token) {
	const decoded = decodeJWT(token)
	const currentUnix = new Date().getTime() / 1000
	return decoded["exp"] <= currentUnix + CONSIDER_EXPIRED_OFFSET
}
