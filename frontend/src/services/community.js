import { useCommunityStore } from "@store/community"
import { useReducer, useState } from "react"

const BACKEND_URL = "http://localhost:8080"

export const useCommunityService = () => {
	const [tokens, dispatch] = useCommunityStore()

	const { auth } = tokens

	const withAuth = function (requestOpts) {
		return {
			...requestOpts,
			headers: {
				...(requestOpts.headers || {}),
				Authorization: "Bearer " + auth,
			},
		}
	}

	const login = async (username, password) =>
		await fetch(BACKEND_URL + "/token/", {
			method: "POST",
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})

	const register = async (username, email, password) =>
		await fetch(BACKEND_URL + "/users/", {
			method: "POST",
			body: JSON.stringify({
				username: username,
				email: email,
				password: password,
			}),
		})

	return {
		login: login,
		register: register,
	}
}
