import THREEViewer from "../three/viewer"

export default class Timeline {
    constructor(element, player) {
        this._element = element
        this._player = player
    }

    set guide(guide) {
        this._guide = guide
        this._populateSteps()
    }
    
    _populateSteps() {
        //TODO: remove elements one by one
        this._element.innerHTML = ''

        let steadyStates = this._guide.steadyStateIDs
        for(let i in steadyStates) {
            let frameID = steadyStates[i]

            let stepElement = document.createElement('div')
            stepElement.innerHTML = this.template(i, frameID)
            
            var player = this._player
            stepElement.addEventListener('click', function () {
                player.selectFrame(frameID)
            }.bind(this))
            this._element.appendChild(stepElement)

            let viewer = new THREEViewer(stepElement.querySelector('.step--preview'))
            viewer.start()

            let cloned = this._guide.clone()
            cloned.selectFrame(frameID)
            viewer.guide = cloned
        }
    }

    template(step, frameID) {
        return `
            <div class="step" data-frame-id="${frameID}">
                <div class="step--preview"></div>
                <span class="step--description">
                    Step ${step}
                </span>
            </div>
        `
    }

    update() {

    }
}