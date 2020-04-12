import React from 'react'
import { useStore } from "../../../store"
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Stop from '@material-ui/icons/Stop';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import styles from './styles.css'

export default function PlaybackControls() {
    const [{ playing, frame, model }, dispatch] = useStore()
    
    const play = () => dispatch({type: 'play'})
    const pause = () => dispatch({type: 'pause'})
    const stop = () => dispatch({type: 'stop'})
    const nextFrame = () => dispatch({type: 'selectFrame', frame: Math.min(model.file_frames.length - 1, frame + 1)})
    const prevFrame = () => dispatch({type: 'selectFrame', frame: Math.max(0, frame - 1)})

    return (
        <div className={styles.controls}>
            {!playing && <ArrowLeft onClick={prevFrame} />}
            {!playing && <PlayArrow onClick={play} />}
            {!playing && <ArrowRight onClick={nextFrame} />}
            {playing && <Pause onClick={pause} />}
            <Stop onClick={stop} />
        </div>
    )
}