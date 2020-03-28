const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new THREE.OrbitControls(camera, renderer.domElement);

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
geometry.vertices.push( new THREE.Vector3( -5, -5, 0 ) );
geometry.vertices.push( new THREE.Vector3(  5, -5, 0 ) );
geometry.vertices.push( new THREE.Vector3(  5,  5, 0 ) );
geometry.vertices.push(new THREE.Vector3(-5, 5, 0));

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

const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);

console.log(face.normal);
console.log(face1.normal);

function vertexPos(geometry, face1, face2) {
  const sharedVer1 = geometry[0];
  const sharedVer2 = geometry[2];
  // const dx = ()
}

function animate() {
  controls.update();

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

animate();
