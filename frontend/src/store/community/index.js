import React from "react"
import { useStore } from "@store/index"

export const useCommunityStore = () => useStore("community")

export const useIsAuthenticated = () => {
	const [{ userId }] = useCommunityStore()
	return !(userId === null || userId === undefined)
}
