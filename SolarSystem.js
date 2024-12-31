// Import required libraries and utilities
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

// Initialize GUI for user interaction
const pane = new Pane();

// Scene setup
const scene = new THREE.Scene();

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Instantiate a group to hold objects
const group = new THREE.Group();

// Geometry for the cubes
const cubeGeometry = new THREE.BoxGeometry();

// Load textures for different maps
const textures = {
    albedo: [
        textureLoader.load('AssignmentTexturess/christmas-wrapping-paper-bl/christmas-wrapping-paper-bl/christmas-wrapping-paper_albedo.png'),
        textureLoader.load('AssignmentTexturess/red-plaid-bl/red-plaid-bl/red-plaid_albedo.png'),
        textureLoader.load('AssignmentTexturess/bird-feathers-2-bl/bird-feathers-2-bl/bird-feathers-2_albedo.png'),
        textureLoader.load('AssignmentTexturess/stylized-animal-fur-bl/stylized-animal-fur-bl/stylized-animal-fur_albedo.png')
    ],
    metallness: [
        textureLoader.load('AssignmentTexturess/christmas-wrapping-paper-bl/christmas-wrapping-paper-bl/christmas-wrapping-paper_height.png'),
        textureLoader.load('AssignmentTexturess/red-plaid-bl/red-plaid-bl/red-plaid_height.png'),
        textureLoader.load('AssignmentTexturess/bird-feathers-2-bl/bird-feathers-2-bl/bird-feathers-2_height.png'),
        textureLoader.load('AssignmentTexturess/stylized-animal-fur-bl/stylized-animal-fur-bl/stylized-animal-fur_height.png')
    ],
    roughness: [
        textureLoader.load('AssignmentTexturess/christmas-wrapping-paper-bl/christmas-wrapping-paper-bl/christmas-wrapping-paper_roughness.png'),
        textureLoader.load('AssignmentTexturess/red-plaid-bl/red-plaid-bl/red-plaid_roughness.png'),
        textureLoader.load('AssignmentTexturess/bird-feathers-2-bl/bird-feathers-2-bl/bird-feathers-2_roughness.png'),
        textureLoader.load('AssignmentTexturess/stylized-animal-fur-bl/stylized-animal-fur-bl/stylized-animal-fur_roughness.png')
    ],
    normal: [
        textureLoader.load('AssignmentTexturess/christmas-wrapping-paper-bl/christmas-wrapping-paper-bl/christmas-wrapping-paper_normal-ogl.png'),
        textureLoader.load('AssignmentTexturess/red-plaid-bl/red-plaid-bl/red-plaid_normal-ogl.png'),
        textureLoader.load('AssignmentTexturess/bird-feathers-2-bl/bird-feathers-2-bl/bird-feathers-2_normal-ogl.png'),
        textureLoader.load('AssignmentTextuess/stylized-animal-fur-bl/stylized-animal-fur-bl/stylized-animal-fur_normal-ogl.png')
    ]
};

// Initialize cube materials with textures
const createCubeMaterial = (albedo, metallness, roughness, normal) => {
    return new THREE.MeshLambertMaterial({
        map: albedo,
        metallnessMap: metallness,
        metalness: 0.5,
        roughnessMap: roughness,
        roughness: 0.5,
        normalMap: normal
    });
};

// Create cubes with individual materials
const cubeMaterials = textures.albedo.map((albedo, index) => 
    createCubeMaterial(albedo, textures.metallness[index], textures.roughness[index], textures.normal[index])
);

// Create cubes and position them
const cubes = [
    new THREE.Mesh(cubeGeometry, cubeMaterials[0]),
    new THREE.Mesh(cubeGeometry, cubeMaterials[1]),
    new THREE.Mesh(cubeGeometry, cubeMaterials[2]),
    new THREE.Mesh(cubeGeometry, cubeMaterials[3])
];

// Position cubes in the scene
cubes[0].position.y = 1;
cubes[1].position.x = 2;
cubes[2].position.y = -0.5;
cubes[3].position.set(2, -1.5, 0);

// Lights setup
const ambLight = new THREE.AmbientLight(0xFFFFFF, 20);
const spotLight = new THREE.SpotLight(0xFFFFAA, 1000, 0, Math.PI / 4, 0.9);
spotLight.position.set(0, 20, 20);

// Add lights to the scene
scene.add(ambLight);
scene.add(spotLight);

// Add cubes to the group and then to the scene
cubes.forEach(cube => group.add(cube));
scene.add(group);

// Camera setup
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 15;

// Renderer setup
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls for camera movement
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Mouse interaction: Toggle rotation on mouse click
let rotate = true;
document.addEventListener('mousedown', () => { rotate = !rotate; });

// Arrow key interaction: Rotate cube manually
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        cubes[0].rotation.y -= 0.1;
    } else if (event.key === 'ArrowRight') {
        cubes[0].rotation.y += 0.1;
    }
});

// Window resize handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main render loop
const renderLoop = () => {
    // Rotate all cubes if toggle is on
    if (rotate) {
        group.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.rotation.y -= 0.01;
            }
        });
    }

    // Update controls and render scene
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderLoop);
};

// Start rendering
renderLoop();
