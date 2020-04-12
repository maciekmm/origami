import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

import { StoreProvider } from './store'
import reducer, {initialState} from './store/reducer'
import '../public/style.css'

export default function AppWithStore() {
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