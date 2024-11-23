import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Water } from 'three-stdlib';
import { Sky } from 'three-stdlib';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox setup
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

// Set sky uniforms
const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

// Update the sun position
const sun = new THREE.Vector3();
sun.setFromSphericalCoords(1, Math.PI / 2, Math.PI / 4); // Example position
sky.material.uniforms['sunPosition'].value.copy(sun);

// Add lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Water texture and material
const waterGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load(
    'assets/textures/waternormals.jpg',
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
});
water.rotation.x = -Math.PI / 2;
scene.add(water);

// Mouse movement effect
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  water.material.uniforms['distortionScale'].value = 3 + mouseX * 2;
  water.material.uniforms['size'].value = 1 + mouseY * 0.5;
});

// Camera positioning
camera.position.set(0, 10, 30);
camera.lookAt(0, 0, 0);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);

// Render loop
const animate = () => {
  requestAnimationFrame(animate);
  water.material.uniforms['time'].value += 0.05; // Animate the water
  renderer.render(scene, camera);
};

animate();
