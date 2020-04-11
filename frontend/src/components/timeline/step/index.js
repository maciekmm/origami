import React from 'react'
import Viewer from "../../viewer"

export default function Step(props) {

    return (
        <div {...props} className="step">
            <Viewer model={props.model} frame={props.frame} />
            <span className="step--description">
                Step {props.frame}
            </span>
        </div>
    )
}