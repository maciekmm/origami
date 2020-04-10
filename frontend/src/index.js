import { Player } from './components/player'
import { GuidePlay } from './guide_play'
import {parseFOLD} from './fold'

const player = new Player(document.body)

document.addEventListener('resize', event => {
    player.onResize(visualizerElement.clientWidth, visualizerElement.clientHeight)
})
