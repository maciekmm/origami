import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import FoldGeometry from '../../three/fold-geometry'

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
    const foldGeometry = useRef(new FoldGeometry()).current
    const model = props.model
    const frame = model.file_frames[props.frame]

    useEffect(() => {
        foldGeometry.clear()
        const baseFrame = model.file_frames[0]

        frame.vertices_coords.forEach(
            (position, id) => {
                foldGeometry.addVertex(...position)
            }
        )

        baseFrame.faces_vertices.forEach(
            vertices => foldGeometry.addFace(vertices)
        )
    }, [model])

    useEffect(() => {
        frame.vertices_coords.forEach(
            (position, id) => {
                foldGeometry.setVertexPosition(id, ...position)
            }
        )
    }, [frame]);

    return (
        <Canvas>
            <SceneConfiguration />
            <mesh>
                <meshBasicMaterial
                    side={THREE.FrontSide}
                    color={0xff0000}
                    vertexColors={THREE.FaceColors}
                    attach="material"
                ></meshBasicMaterial>
                <primitive attach="geometry" object={foldGeometry.geometry} />
                <mesh>
                    <meshBasicMaterial
                        side = {THREE.BackSide}
                        color = {0x00ff00}
                        vertexColors = {THREE.FaceColors}
                        attach = "material"
                    ></meshBasicMaterial>
                    <primitive attach="geometry" object={foldGeometry.geometry} />
                </mesh>
            </mesh>
        </Canvas>
    )
}