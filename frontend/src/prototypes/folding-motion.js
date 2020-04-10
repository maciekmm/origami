import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { dotProduct, mat, normalize, vec } from '@josh-brown/vector';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

window.scene = scene;
window.THREE = THREE;


// camera.rotation.x = Math.PI / 4;

camera.position.y = -10;
camera.position.x = -5;
camera.position.z = 5;

const material = new THREE.MeshBasicMaterial({
  // olor : 0xff0000,
  vertexColors: THREE.FaceColors,
  side: THREE.DoubleSide,
} );


const EdgeAssignment = Object.freeze({
  FLAT: "FLAT",
  MOUNTAIN: "MOUNTAIN",
  VALLEY: "VALLEY",
});

class Face {
  constructor(faces) {
    this.faces = faces;
  }
}

class Edge {
  constructor(from, to, assignment) {
    this.from = from;
    this.to = to;
    this.assignemt = assignment;
  }
}

function Vector3FromEdges(edge1, edge2, edge3) {
  return new THREE.Vector3(edge1.from, edge1.to, edge2.to);
}


//create a triangular geometry
const geometry = new THREE.Geometry();
geometry.vertices.push( new THREE.Vector3( -1, -1, 0 ) );
geometry.vertices.push( new THREE.Vector3(  1, -1, 0 ) );
geometry.vertices.push( new THREE.Vector3(  1,  1, 0 ) );

const oppositeVertexOriginal = {
  x: -1,
  y: 1,
  z: 0
};

geometry.vertices.push(new THREE.Vector3(oppositeVertexOriginal.x, oppositeVertexOriginal.y, oppositeVertexOriginal.z));

// geometry.vertices.push( new THREE.Vector3( 5, -5, 0 ) );
// geometry.vertices.push( new THREE.Vector3(  15, -5, 0 ) );
// geometry.vertices.push( new THREE.Vector3(  15,  5, 0 ) );
// geometry.vertices.push(new THREE.Vector3(5, 5, 0));

//create a new face using vertices 0, 1, 2
// const normal = new THREE.Vector3( 0, 0, 1 ); //optional
const color = new THREE.Color( 0xff0000 ); //optional
const color1 = new THREE.Color( 0x00ff00 ); //optional

const face = new THREE.Face3( 0, 1, 2, null, color );
const face1 = new THREE.Face3( 0, 2, 3, null, color1);

geometry.faces.push(face);
geometry.faces.push(face1);

// const face2 = new THREE.Face3(4, 5, 6, null, color1);
// const face3 = new THREE.Face3(4, 6, 7, null, color1);

// const faceN = new Face([face, face1]);
// const faceN1 = new Face([face2, face3]);

//add the face to the geometry's faces array
// for (const f of faceN.faces) {
//   geometry.faces.push(f);
// }

// for (const f of faceN1.faces) {
//   geometry.faces.push(f);
// }

// geometry.faces.push( face ); geometry.faces.push( face1 );

console.log(geometry.faces);

//the face normals and vertex normals can be calculated automatically if not supplied above
geometry.computeFaceNormals();
// geometry.computeVertexNormals();

let mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);

console.log(face.normal);
console.log(face1.normal);

function oppositeVertexPos(geometry, face1, face2) {
  const vertices = geometry.vertices;

  const sv1 = vertices[0];
  const sv2 = vertices[2];
  const op = vertices[3];

  let x = vec([op.x - sv1.x, op.y - sv1.y, op.z - sv1.z]);
  let y = vec([sv2.x - sv1.x, sv2.y - sv1.y, sv2.z - sv1.z]);
  const unitInv = vec([-1, -1, -1]);

  let d = x.projectOnto(y);
  let xInv = x.combine(unitInv, (a, b) => a * b);

  const z = d.add(xInv);
  const oppositePosVec = x.add(z.add(z));

  // console.log(x);
  // console.log(y);
  // console.log(d);
  // console.log(z);
  // console.log(oppositePosVec);

  return [{
    x: sv1.x + oppositePosVec.getEntry(0),
    y: sv1.y + oppositePosVec.getEntry(1),
    z: sv1.z + oppositePosVec.getEntry(2),
  }, vecLength(z), z.add(z)];
}

function vecLength(v) {
  return Math.sqrt(Math.pow(v.getEntry(0), 2) + Math.pow(v.getEntry(1), 2) + Math.pow(v.getEntry(2), 2))
}

function angleBetweenVec(v1, v2) {
  return Math.acos(dotProduct(v1, v2) / (vecLength(v1) * vecLength(v2)));
}

const op = geometry.vertices[3];
const [oppositeVertex, radius, oppositeVec] = oppositeVertexPos(geometry);
const oppositeVecNormalized = normalize(oppositeVec);


console.log(radius);
// geometry.vertices[3] = new THREE.Vector3(oppositeVertex.x, oppositeVertex.y, oppositeVertex.z + 0.01);

// const normal1 = vec([face.normal.x, face.normal.y, face.normal.z]);
// const normal2 = vec([face1.normal.x, face1.normal.y, face1.normal.z]);
// console.log(angleBetweenVec(normal1, normal2));


let animatedYet = false;
const theta = Math.PI / 4;
const planeRot = mat([
  [Math.cos(theta), -Math.sin(theta), 0],
  [Math.sin(theta), Math.cos(theta) ,0],
  [0, 0, 1]]);

let time = 0
let framNo = 0
let frames = []

function animate(t) {
  controls.update();
  // t = t / 1000;
  time += 0.05;
  t = time

  if (Math.sin(t) < 0) {
    animatedYet = true;
  console.log(JSON.stringify(frames))
  }


  if (!animatedYet) {

    const x = 0;
    const z = radius * Math.sin(t);
    const y = radius * Math.cos(t);

    const coord = planeRot.multiply(mat([[x, y ,z]]).transpose()).getColumn(0);
    geometry.vertices[3] = new THREE.Vector3(coord.getEntry(0), coord.getEntry(1), coord.getEntry(2))
    let frame = {
      "frame_inherit": true,
      "frame_parent": framNo++,
      "vertices_position": geometry.vertices.map(vert => [vert.x, vert.y, vert.z])
    }
    frames.push(frame)

    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;

    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    scene.add( line );
  }


  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate(0);
