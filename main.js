import * as THREE from 'three';
import * as utils from '/utils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#021129');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Bright light
directionalLight.position.set(1, 1, -2);
directionalLight.castShadow = true;
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

//Camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3,3,3);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = true;
controls.target.set( 0, 0.5, 0 );
controls.update();

// Ground
const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
//scene.add( mesh );

// Load Meshes Function
const loader = new GLTFLoader();

let meshes = {}; // Dictionary to store the meshes

// Uses the relative filepath to load the mesh and adds it to the meshes dictionary
function loadMesh(fileName, key, isVisible = true) {
    loader.load(fileName, function (gltf) {
        meshes[key] = gltf.scene;
        meshes[key].castShadow = true;
        meshes[key].visible = isVisible; // Setting the visibility here ensure the mesh is fully loaded
        scene.add(meshes[key]);
    }, undefined, function (error) {
        console.error('Error loading', fileName, error);
    });
}

// Meshes are located in a folder called "Meshes"
// Load each mesh using the function
loadMesh('../assets/Meshes/Carter01.glb', 'Carter01');
loadMesh('../assets/Meshes/Carter02.glb', 'Carter02');
loadMesh('../assets/Meshes/0.glb', 'Sys0', false);
loadMesh('../assets/Meshes/1.glb', 'Sys1', false);
loadMesh('../assets/Meshes/2.glb', 'Sys2', false);
loadMesh('../assets/Meshes/3.glb', 'Sys3', false);
loadMesh('../assets/Meshes/4.glb', 'Sys4');

// Raycaster to detect mouse clicks on the mesh
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Rotation settings
let rotating = false;
let rotationSpeed = 0.08;
let rotatingDirection = 1; // 1 or -1
let maxRotation = 2;  //Angle in radians

// Animate and render the scene
function animate() {
    requestAnimationFrame(animate);

    if (rotating) {
        // Calculate progress (normalized between 0 and 1)
        const progress = Math.abs(meshes["Carter01"].rotation.y / maxRotation);
        
        // Apply easing to the rotation speed
        const easedSpeed = rotationSpeed * Math.sqrt(((Math.sin(Math.PI * ((progress*2)-0.5))+1)/2)+rotationSpeed);

        // Update rotation based on the current direction
        meshes["Carter01"].rotation.y += easedSpeed * rotatingDirection;

        // Clamp rotation and reverse direction when limits are reached
        if (meshes["Carter01"].rotation.y >= maxRotation) {
            meshes["Carter01"].rotation.y = maxRotation;
            rotating = !rotating;  // Stop or change direction
            rotatingDirection *= -1;  // Reverse the direction
        }
        if (meshes["Carter01"].rotation.y <= 0) {
            meshes["Carter01"].rotation.y = 0;
            rotating = !rotating;
            rotatingDirection *= -1;
        }
    }

    renderer.render(scene, camera);
}

animate();

// Detect click events
window.addEventListener('click', (event) => {
// Calculate mouse position in normalized device coordinates (-1 to +1)
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

// Update raycaster with camera and mouse position
raycaster.setFromCamera(mouse, camera);

// Detect intersected objects
const intersects = raycaster.intersectObject(meshes["Carter01"]);

if (intersects.length > 0) {
    rotating = !rotating; // Toggle rotation on click
}
});

// MouseOver Handlers
function _1K(){
    meshes['Sys0'].visible = false;
    meshes['Sys1'].visible = false;
    meshes['Sys2'].visible = false;
    meshes['Sys3'].visible = false;
}

function _1Kplus(){
    meshes['Sys0'].visible = true;
    meshes['Sys1'].visible = false;
    meshes['Sys2'].visible = false;
    meshes['Sys3'].visible = false;
}

function _2K(){
    meshes['Sys0'].visible = false;
    meshes['Sys1'].visible = true;
    meshes['Sys2'].visible = false;
    meshes['Sys3'].visible = false;
}

function _2Kplus(){
    meshes['Sys0'].visible = true;
    meshes['Sys1'].visible = true;
    meshes['Sys2'].visible = false;
    meshes['Sys3'].visible = false;
}

function _3K(){
    meshes['Sys0'].visible = true;
    meshes['Sys1'].visible = true;
    meshes['Sys2'].visible = true;
    meshes['Sys3'].visible = false;
}

// MouseOver Events
document.getElementById("1K").addEventListener("mouseenter", ()=> _1K())
document.getElementById("1K+").addEventListener("mouseenter", ()=> _1Kplus())
document.getElementById("2K").addEventListener("mouseenter", ()=> _2K())
document.getElementById("2K+").addEventListener("mouseenter", ()=> _2Kplus())
document.getElementById("3K").addEventListener("mouseenter", ()=> _3K())