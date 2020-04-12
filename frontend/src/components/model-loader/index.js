import React from 'react'
import { useStore } from '../../store'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import preprocessFOLDModel from '../../fold/preprocess'

export default function ModelLoader() {
    const [{ model }, dispatch] = useStore()

    const loadModel = (event) => {
        const fileReader = new FileReader()
        fileReader.onload = (data) => {
            const foldModel = JSON.parse(data.target.result)
            dispatch({ type: 'loadModel', model: preprocessFOLDModel(foldModel) })
        }
        fileReader.readAsText(event.target.files[0])
    }

    return (
        <label>
            <InsertDriveFile />
            {model && <span>{model.file_author}</span>}
            <input id="load-model" onChange={loadModel} type="file" />
        </label>
    )
}