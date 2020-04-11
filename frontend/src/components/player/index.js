import React from 'react'
import Viewer from '../viewer'
import { useStore } from '../../store'
import { isSteady } from '../../fold/tools'
import { useAfter } from '../../hooks'

export default function Player() {
    const [{ model, frame, playing }, dispatch] = useStore()

    const step = () => dispatch({ type: 'selectFrame', frame: frame + 1 })
    const pause = () => dispatch({ type: 'pause' })

    useAfter(() => {
        if (!playing) return
        
        step()
        
        if(isSteady(model.file_frames[frame + 1])) {
            pause()
        }
    }, 1000 / model.file_frameRate, [playing, frame, model])

    return (
        <div className="test">
            <Viewer model={model} frame={frame} />
        </div>
    )
}