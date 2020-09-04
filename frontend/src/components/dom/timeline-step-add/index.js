import TimelineStep from "@dom-components/timeline-step"
import AddIcon from "@material-ui/icons/Add"
import React from "react"

export function TimelineStepAdd({ addStep }) {
	// It's not possible to add className to material-ui icon, therefore we have to hardcode the style
	return (
		<TimelineStep title="New step" onClick={addStep}>
			<AddIcon style={{ flexShrink: "1", margin: "0 auto", height: "100%" }} />
		</TimelineStep>
	)
}
