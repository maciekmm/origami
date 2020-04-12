import React from 'react'
import PlaybackControls from '../../components/playback-controls'
import ModelLoader from '../../components/model-loader'
import { useStore } from '../../store'
import styles from './styles.css'
import { PLAY, PAUSE, STOP, SELECT_NEXT_FRAME, SELECT_PREVIOUS_FRAME } from '../../store/actions';

export default function Header() {
    const [{ playing, model }, dispatch] = useStore()

    const play = () => dispatch({ type: PLAY })
    const pause = () => dispatch({ type: PAUSE })
    const stop = () => dispatch({ type: STOP })
    const nextFrame = () => dispatch({ type: SELECT_NEXT_FRAME })
    const prevFrame = () => dispatch({ type: SELECT_PREVIOUS_FRAME })

    return (
        <header className={styles.header}>
            <ModelLoader />
            {model && <PlaybackControls
                playing={playing}
                play={play}
                pause={pause}
                stop={stop}
                nextFrame={nextFrame}
                prevFrame={prevFrame}
            />}
        </header>
    )
}
