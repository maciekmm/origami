import React, { useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
	Canvas,
	extend,
	useThree,
	useFrame,
	useResource,
} from "react-three-fiber"
import Figure from "../../components/figure"

extend({ OrbitControls })

function SceneConfiguration() {
	const {
		camera,
		gl: { domElement },
	} = useThree()

	const [lightRef, light] = useResource()

	useFrame(() => {
		lightRef.current.position.copy(camera.position)
	})

	return (
		<>
			<orbitControls args={[camera, domElement]} />
			<ambientLight intensity={0.3} />
			<pointLight ref={lightRef} intensity={0.8} />
		</>
	)
}

export default function Viewer(props) {
	return (
		<Canvas>
			<SceneConfiguration />
			<Figure {...props} />
		</Canvas>
	)
}
