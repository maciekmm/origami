import React from "react"
import ModelLoader from "@dom-components/model-loader"
import styles from "./styles.css"

export default function ViewerHeader({ model, loadModel, children }) {
	return (
		<header className={styles.header}>
			<ModelLoader loadModel={loadModel} name={!!model && model.file_author} />
			{children}
		</header>
	)
}
