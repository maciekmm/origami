import React from 'react'
import PlaybackControls from './playback-controls'
import ModelLoader from './model-loader'
import { useStore } from '../../store'
import styles from './styles.css'

export default function Header() {
    const [{model}] = useStore()

    return (
        <header className={styles.header}>
            <ModelLoader />
            { model && <PlaybackControls /> }
        </header>
    )
}
