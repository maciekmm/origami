import { useEffect } from "react"

export const useAfter = (callback, after, deps) => {
	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		let tid = setTimeout(() => {
			callback()
		}, after)

		return () => {
			clearTimeout(tid)
		}
	}, [after, callback, ...deps])
}
