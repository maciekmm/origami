import THREEViewer from './three/viewer'
import {GuidePlay} from './guide_play'
import {parseFOLD} from './fold'


async function renderModel(model) {
    const play = new GuidePlay(parseFOLD(model))
    viewer.setGuide(play)
    viewer.play()
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