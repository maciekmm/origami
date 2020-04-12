import React from 'react'
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Stop from '@material-ui/icons/Stop';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import styles from './styles.css'

export default function PlaybackControls(props) {
    const playing = props.playing

    return (
        <div className={styles.controls}>
            {!playing && <ArrowLeft onClick={props.prevFrame} />}
            {!playing && <PlayArrow onClick={props.play} />}
            {!playing && <ArrowRight onClick={props.nextFrame} />}
            {playing && <Pause onClick={props.pause} />}
            <Stop onClick={props.stop} />
        </div>
    )
}