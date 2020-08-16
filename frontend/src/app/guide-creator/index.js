import React from "react"
import { useStore } from "../../store"
import Header from "./header"
import Player from "./player"
import Timeline from "./timeline"

export default function GuideCreator() {
	const [{ model }] = useStore()

	return (
		<>
			<Header />
			{model && <Player />}
			{model && <Timeline />}
		</>
	)
}
