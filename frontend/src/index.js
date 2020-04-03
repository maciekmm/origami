import THREEViewer from './three/viewer'
import THREEModel from './three/model'

const viewer = new THREEViewer()

async function renderModel(model) {
    if (!model['vertices_coords']) {
        console.error("missing vertices_coords in loaded model")
        return
    }
    const threeModel = new THREEModel()
    model['vertices_coords'].forEach(
        position => threeModel.addVertex(...position)
    )

    model['faces_vertices'].forEach(
        vertices => threeModel.addFace(vertices)
    )

    viewer.model = threeModel
}

const loadInput = document.getElementById("load-model")
loadInput.addEventListener('change', (event) => {
    const fileReader = new FileReader()
    fileReader.onload = function(data) {
        renderModel(JSON.parse(data.target.result))
    }
    fileReader.readAsText(loadInput.files[0])
})

async function initialLoad() {
    const modelURL = "models/simple.fold"
    const fetched = await fetch(modelURL)
    const model = await fetched.json()
    renderModel(model)
}

initialLoad()
viewer.start()