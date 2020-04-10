import { GuidePlay } from '../guide_play'
import {parseFOLD} from '../fold'

export default class Controls {
    constructor(element, player) {
        this._player = player

        this._play = element.querySelector("#ctrl-play")
        this._pause = element.querySelector("#ctrl-pause")
        this._stop = element.querySelector("#ctrl-stop")
        
        this._load = element.querySelector("#load-model")
        this._modelName = element.querySelector("#model-name")
        this._attachListeners()
    }

    renderModel(model) {
        const play = new GuidePlay(parseFOLD(model))
        this._player.guide = play
        this._player.play()
    }

    _attachListeners() {
        this._play.addEventListener('click', function(event) {
            event.preventDefault()
            this._player.play()            
        }.bind(this))
        this._pause.addEventListener('click', function(event) {
            event.preventDefault()
            this._player.pause()            
        }.bind(this))
        this._stop.addEventListener('click', function(event) {
            event.preventDefault()
            this._player.stop()            
        }.bind(this))

        this._load.addEventListener('change', (event) => {
            const fileReader = new FileReader()
            fileReader.onload = (data) => {
                this.renderModel(JSON.parse(data.target.result))
            }
            this._modelName.innerText = this._load.files[0].name
            fileReader.readAsText(this._load.files[0])
        })
    }
}