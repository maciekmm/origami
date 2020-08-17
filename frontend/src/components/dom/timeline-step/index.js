import React from "react"
import Viewer from "../viewer"
import styles from "./styles.css"

export default function TimelineStep({ model, frame, title, ...handlers }) {
	return (
		<div {...handlers} className={styles.step}>
			<Viewer model={model} frame={frame} />
			<span className={styles.description}>{title}</span>
		</div>
	)
}