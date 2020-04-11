import React from 'react'
import PlaybackControls from './playback-controls'
import ModelLoader from './model-loader'
import { useStore } from '../../store'

export default function Header() {
    const [{model}] = useStore()

    return (
        <header id="controls" className="menu">
            <ModelLoader />
            { model && <PlaybackControls /> }
        </header>
    )
}
