import React from "react"
import styles from "./styles.css"
import DeleteIcon from "@material-ui/icons/Delete"

export default function TimelineStep({
	children,
	selected,
	title,
	removable,
	onRemove,
	...handlers
}) {
	return (
		<div
			{...handlers}
			className={styles.step + " " + (selected ? styles.selected : "")}
		>
			{removable && (
				<DeleteIcon
					className={styles.delete}
					color="action"
					fontSize="small"
					onClickCapture={(event) => {
						event.stopPropagation()
						onRemove()
					}}
				/>
			)}
			{children}
			<span className={styles.description}>{title}</span>
		</div>
	)
}
