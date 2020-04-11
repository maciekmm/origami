export default function reducer(state, action) {
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
        case 'stop':
            return {
                ...state,
                playing: false,
                frame: 0
            }
        default:
            throw new Error(`action type ${action.type} not recognized`)
    }
}