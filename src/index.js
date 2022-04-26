//CAPNGANJ Bunny on Shrooms fxhash generative token
//April, 2022

//imports
import { Features } from './Features';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Bunny from './bunnyUV.obj';


//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new Features();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Temperature" : feet.color.tag,
  "Zone" : feet.env.tag,
  "Density": feet.density.tag
};
console.log(window.$fxhashFeatures);

//vars related to fxhash preview call
//loaded tracks whether texture has loaded;
//previewed tracks whether preview has been called
let loaded = false;
let previewed = false;

//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
//console.log("fxhash features", window.$fxhashFeatures);


//2) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2

//scene & camera
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { 
  antialias: true,
  alpha: true
} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 5, 5, 5 );

//lights
const amb = new THREE.AmbientLight(0xffffff);
scene.add(amb);

// controls
let controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping=true;
controls.dampingFactor = 0.2;
controls.autoRotate= true;
controls.maxDistance = 10;
controls.minDistance = 2;


//shader uniforms!
let uniforms= {
  //used by both vertex and fragment
  time: { value: 1.0 },

  //vertex only
  scale: { value: 1.0 },
  displacement: { value: 0.01 },
  speed: { value: 0.5 },

  //fragment only
  fragSpeed: { value: 1.0 },
  uvScale: { value: [2.0, 2.0]},
  brightness: { value: 1.0 },
  permutations: { value: 1.0 },
  iterations: { value: 1.0 },
  color1: { value: [0,0,0]},
  color2: { value: [1,1,1]},
  color3: { value: [0.5,0.5,0.5]},
};

//bunny model load
const objLoader = new OBJLoader();
objLoader.load(Bunny, (bunny) => {

  //placeholder material for testing
  const material2 = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

  //first shot at a shader material
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent 
  });
  
  //add mesh to scene <3
  const mesh = new THREE.Mesh(bunny.children[0].geometry, material);
  mesh.scale.set(20,20,20);
  mesh.position.y -= 2;
  scene.add(mesh);

  //loaded flag for fxhash capture
  loaded = true;
})


//set the background color 
let bod = document.body;
bod.style.backgroundColor = feet.color.value;


//set up resize listener and let it rip!
window.addEventListener( 'resize', onWindowResize );
animate();


// threejs animation stuff
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

  requestAnimationFrame( animate );

  uniforms[ 'time' ].value = performance.now() / 1000;

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}


function render() {

  renderer.render( scene, camera );

  if(previewed == false && loaded == true){
    fxpreview();
    previewed = true;
  } 

  //mesh.rotation.y += 0.001;

}
