import React from 'react'
import Viewer from '../viewer'
import { useStore } from '../../store'
import { isSteady } from '../../fold/tools'
import { useAfter } from '../../hooks'
import styles from './styles.css'

export default function Player() {
    const [{ model, frame, playing }, dispatch] = useStore()

    const step = () => dispatch({ type: 'selectFrame', frame: frame + 1 })
    const pause = () => dispatch({ type: 'pause' })
    const isLastFrame = model.file_frames.length === frame + 1

    useAfter(() => {
        if (!playing) {
            return
        }

        if(isLastFrame) {
            pause()
            return
        }
        
        step()
        
        if(isSteady(model.file_frames[frame + 1])) {
            pause()
        }
    }, 1000 / model.file_frameRate, [playing, frame, model])

    return (
        <div className={styles.player}>
            <Viewer model={model} frame={frame} />
        </div>
    )
}