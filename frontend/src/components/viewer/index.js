import React from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Canvas, extend, useThree } from 'react-three-fiber'
import Figure from '../../components/figure'

extend({ OrbitControls })

function SceneConfiguration() {
    const {
        camera,
        gl: { domElement }
    } = useThree()

    return (
        <>
            <orbitControls args={[camera, domElement]} />
            <ambientLight />
            <pointLight position={[5, 5, 5]} />
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