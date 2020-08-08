import React, { useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Canvas, extend, useThree, useFrame } from "react-three-fiber"
import Figure from "../../components/figure"

extend({ OrbitControls })

function SceneConfiguration() {
	const {
		camera,
		gl: { domElement },
	} = useThree()

	const lightRef = useRef()

	useFrame(() => {
		lightRef.current.position.copy(camera.position)
	})

	return (
		<>
			<orbitControls args={[camera, domElement]} />
			<ambientLight />
			<pointLight ref={lightRef} intensity={0.5} position={[5, 5, 5]} />
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
