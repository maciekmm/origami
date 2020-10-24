import React from "react"
import InsertDriveFile from "@material-ui/icons/InsertDriveFile"

export default function ModelLoader({ name, loadModel, component }) {
	const loadSelectedFile = (event) => {
		const fileReader = new FileReader()
		fileReader.onload = (data) => {
			const foldModel = JSON.parse(data.target.result)
			loadModel(foldModel)
		}
		fileReader.readAsText(event.target.files[0])
	}

	const labelComponent =
		component === undefined ? (
			<>
				<InsertDriveFile />
				{name && <span>{name}</span>}
			</>
		) : (
			component
		)

	return (
		<label>
			{labelComponent}
			<input
				id="load-model"
				onChange={loadSelectedFile}
				type="file"
				style={{ display: "none" }}
			/>
		</label>
	)
}
