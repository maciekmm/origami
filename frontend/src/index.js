import THREEViewer from './three/viewer'
import THREEGuide from './three/guide'


async function renderModel(model) {
    if (!model['vertices_coords']) {
        console.error("missing vertices_coords in loaded model")
        return
    }
    const guide = new THREEGuide(extractFrames(model))
    viewer.setGuide(guide)
}

function extractFrames(foldModel) {
    if(!foldModel.file_frames) {
        return [foldModel]
    }
    foldModel.file_frames[0].vertices_coords = foldModel.file_frames[0].vertices_coords.map(
        vertex => [vertex[0] + 0.05 * Math.random(), vertex[1] + 0.05*Math.random(), vertex[2] + 0.05*Math.random()]
    )
    foldModel.file_frames[1].vertices_coords = foldModel.file_frames[1].vertices_coords.map(
        vertex => [vertex[0] + 0.05 * Math.random(), vertex[1] + 0.05*Math.random(), vertex[2] + 0.05*Math.random()]
    )
    return [foldModel, ...foldModel.file_frames]
}

async function initialLoad() {
    const modelURL = "models/simple.fold"
    const fetched = await fetch(modelURL)
    const model = await fetched.json()
    renderModel(model)
}

const visualizerElement = document.querySelector("#visualizer")
const viewer = new THREEViewer(visualizerElement.clientWidth, visualizerElement.clientHeight)
const loadInput = document.getElementById("load-model")
loadInput.addEventListener('change', (event) => {
    const fileReader = new FileReader()
    fileReader.onload = function(data) {
        renderModel(JSON.parse(data.target.result))
    }
    fileReader.readAsText(loadInput.files[0])
})

initialLoad()
viewer.render(visualizerElement)

function stepper() {
    viewer.step()
}

setInterval(stepper, 100)

// viewer.step()