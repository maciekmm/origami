export default class Controls {
    constructor(element, player) {
        this._player = player

        this._play = element.querySelector("#ctrl-play")
        this._pause = element.querySelector("#ctrl-pause")
        this._stop = element.querySelector("#ctrl-stop")

        this._attachListeners()
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
    }


}