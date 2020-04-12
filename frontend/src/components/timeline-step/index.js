import React from 'react'
import Viewer from "../viewer"
import styles from './styles.css'

export default function TimelineStep(props) {

    return (
        <div {...props} className={styles.step}>
            <Viewer model={props.model} frame={props.frame} />
            <span className={styles.description}>
                Step {props.frame}
            </span>
        </div>
    )
}