import React from 'react'
import Step from './step'
import { useStore } from "../../store";
import { getSteadyFrameIds } from "../../fold/tools";

export default function Timeline() {
    const [{ model, frame }, dispatch] = useStore()

    const selectFrame = (frame) => dispatch({ type: 'selectFrame', frame: frame })

    const steadyIds = model ? getSteadyFrameIds(model.file_frames) : []

    const steps = steadyIds.map(
        (steadyFrameId, seq) => {
            const nextSteadyId = steadyIds.length == seq - 1 ? steadyIds[seq + 1] : null

            const framesBehind = frame - steadyFrameId
            const totalFrames = nextSteadyId - steadyFrameId
            const fracOfFramesCovered = nextSteadyId ? framesBehind / totalFrames : 1

            return <Step
                model={model}
                frame={steadyFrameId}
                progress={fracOfFramesCovered}
                onClick={() => selectFrame(steadyFrameId)}
                key={steadyFrameId}
            />
        }
    )

    return (
        <aside id="timeline">
            {steps}
        </aside>
    )
}