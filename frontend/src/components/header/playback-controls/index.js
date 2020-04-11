import React from 'react'
import { useStore } from "../../../store"
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Stop from '@material-ui/icons/Stop';

export default function PlaybackControls() {
    const [{ playing }, dispatch] = useStore()
    
    const play = () => dispatch({type: 'play'})
    const pause = () => dispatch({type: 'pause'})
    const stop = () => dispatch({type: 'stop'})

    return (
        <div>
            {!playing && <PlayArrow onClick={play} />}
            {playing && <Pause onClick={pause} />}
            <Stop onClick={stop} />
        </div>
    )
}