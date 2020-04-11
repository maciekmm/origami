import React from 'react'
import { StoreProvider } from './store'
import App from './components/app'

const reducer = (state, action) => {
    switch (action.type) {
        case 'selectFrame':
            return {
                ...state,
                frame: action.frame
            }
        case 'loadModel':
            return {
                ...state,
                model: action.model,
                frame: 0
            }
        case 'play':
            return {
                ...state,
                playing: true
            }
        case 'pause':
            return {
                ...state,
                playing: false
            }
        default:
            console.warn('undefined action type ' + action.type)
            return state
    }
}

export default function AppEntry() {
    const initialState = {
        model: null,
        frame: -1,
        playing: false
    }

    return (
        <StoreProvider initialState={initialState} reducer={reducer}>
            <App />
        </StoreProvider>
    )
}