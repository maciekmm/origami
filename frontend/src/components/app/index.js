import React from 'react'
import { useStore } from '../../store'
import Header from '../header'
import Player from '../player'
import Timeline from '../timeline'

export default function App() {
    const [{ model }, dispatch] = useStore()

    return (
        <>
            <Header />
            {model && <Player />}
            {model && <Timeline />}
        </>
    )
}