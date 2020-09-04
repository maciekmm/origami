import React from "react"
import ModelLoader from "@dom-components/model-loader"
import styles from "./styles.css"
import Grid from "@material-ui/core/Grid"

export default function ViewerHeader({ model, loadModel, children }) {
	return (
		<Grid container className={styles.header}>
			<Grid item xs={2}>
				<ModelLoader loadModel={loadModel} name={!!model && model.file_title} />
			</Grid>
			<Grid item xs>
				{children}
			</Grid>
		</Grid>
	)
}
