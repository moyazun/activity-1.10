// Import Three.js
import * as THREE from 'three';
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm'; // Import GUI library

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

// Set up a camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(3, 2, 5); // Adjusted for a better view
camera.lookAt(0, 0, 0);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Load the environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
]);

// Material with adjustable metalness and roughness
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color
    metalness: 0.7,  // Initial reflective surface
    roughness: 0.2,  // Initial smooth surface
    envMap: environmentMapTexture, // Add the environment map to the material
    envMapIntensity: 1.0, // Optional: Control intensity of the environment reflections
});


// Create geometries
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.set(-1.5, 0, 0); // Sphere on the left

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 32, 64), material);
torus.position.set(1.5, 0, 0); // Torus on the right
torus.rotation.z = Math.PI / 4; // Tilt the torus

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
plane.rotation.x = Math.PI / 2; // Tilt the plane
plane.rotation.z = Math.PI / 6; // Angled in the Z-axis
plane.position.set(0, 0, 0); // Center the plane

// Add objects to the scene
scene.add(sphere, torus, plane);

/**
 * GUI Controls
 */
const gui = new GUI();
const materialFolder = gui.addFolder('Material Controls');
materialFolder.add(material, 'metalness', 0, 1, 0.01).name('Metalness'); // Add metalness control
materialFolder.add(material, 'roughness', 0, 1, 0.01).name('Roughness'); // Add roughness control
materialFolder.open(); // Open the folder by default

/**
 * Animate the objects
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Optional: Add rotation animations for objects
    sphere.rotation.y = 0.2 * elapsedTime;
    plane.rotation.y = 0.2 * elapsedTime;
    torus.rotation.y = 0.2 * elapsedTime;

    // Render the scene
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

// Start the animation loop
tick();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
