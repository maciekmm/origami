import { Player } from './components/player'
import { GuidePlay } from './guide_play'
import {parseFOLD} from './fold'

const player = new Player(document.body)

async function renderModel(model) {
    const play = new GuidePlay(parseFOLD(model))
    player.guide = play
    player.play()
}

const loadInput = document.getElementById("load-model")
loadInput.addEventListener('change', (event) => {
    const fileReader = new FileReader()
    fileReader.onload = function(data) {
        renderModel(JSON.parse(data.target.result))
    }
    document.querySelector("#model-name").innerText = loadInput.files[0].name
    fileReader.readAsText(loadInput.files[0])
})

document.addEventListener('resize', event => {
    viewer.onResize(visualizerElement.clientWidth, visualizerElement.clientHeight)
})
