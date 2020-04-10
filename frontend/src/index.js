import THREEViewer from './three/viewer'
import {GuidePlay, STEADY_STATE} from './guide_play'


async function renderModel(model) {
    if (!model['vertices_coords']) {
        console.error("missing vertices_coords in loaded model")
        return
    }
    const guide = new GuidePlay(extractFrames(model))
    viewer.setGuide(guide)
    viewer.play()
}

function extractFrames(foldModel) {
    if(!!foldModel.frame_classes) {
        foldModel.frame_classes = [STEADY_STATE]
    } else {
        foldModel.frame_classes = [...foldModel.frame_classes, STEADY_STATE]
    }
    if(!foldModel.file_frames) {
        return [foldModel]
    }
    return [foldModel, ...foldModel.file_frames]
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

document.addEventListener('resize', event => {
    viewer.onResize(visualizerElement.clientWidth, visualizerElement.clientHeight)
})

viewer.render(visualizerElement)