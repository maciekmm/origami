import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

import { StoreProvider } from './store'
import reducer from './store/reducer'

export default function AppWithStore() {
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

ReactDOM.render(
    <AppWithStore />,
    document.getElementById("app")
);