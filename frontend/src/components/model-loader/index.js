import React from "react"
import InsertDriveFile from "@material-ui/icons/InsertDriveFile"
import preprocessFOLDModel from "../../fold/preprocess"

export default function ModelLoader(props) {
	const loadModel = (event) => {
		const fileReader = new FileReader()
		fileReader.onload = (data) => {
			const foldModel = JSON.parse(data.target.result)
			props.loadModel(preprocessFOLDModel(foldModel))
		}
		fileReader.readAsText(event.target.files[0])
	}

	return (
		<label>
			<InsertDriveFile />
			{props.model && <span>{props.model.file_author}</span>}
			<input id="load-model" onChange={loadModel} type="file" />
		</label>
	)
}
