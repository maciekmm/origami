import React from "react"
import styles from "./styles.css"

export default function TimelineStep({ children, title, ...handlers }) {
	return (
		<div {...handlers} className={styles.step}>
			{children}
			<span className={styles.description}>{title}</span>
		</div>
	)
}
