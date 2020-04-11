import React from 'react'
import PlaybackControls from './playback-controls'
import ModelLoader from './model-loader'

export default function Header() {
    return (
        <header id="controls" className="menu">
            <ModelLoader />
            <PlaybackControls />
        </header>
    )
}
