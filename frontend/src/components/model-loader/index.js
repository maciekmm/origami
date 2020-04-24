import React from "react"
import InsertDriveFile from "@material-ui/icons/InsertDriveFile"

export default function ModelLoader(props) {
	const loadModel = (event) => {
		const fileReader = new FileReader()
		fileReader.onload = (data) => {
			const foldModel = JSON.parse(data.target.result)
			props.loadModel(foldModel)
		}
		fileReader.readAsText(event.target.files[0])
	}

	return (
		<label>
			<InsertDriveFile />
			{props.name && <span>{props.name}</span>}
			<input id="load-model" onChange={loadModel} type="file" />
		</label>
	)
}
