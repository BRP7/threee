import * as THREE from 'three';
import { Water } from 'three-stdlib';
import { Sky } from 'three-stdlib';

// Basic Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox Setup
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

const sun = new THREE.Vector3();
sun.setFromSphericalCoords(1, Math.PI / 2, Math.PI / 4); // Adjust for desired sun position
sky.material.uniforms['sunPosition'].value.copy(sun);

// Water Texture and Material (With Dynamic Waves)
const waterGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }),
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x4E8C8C, // Light teal for more realistic water color
  distortionScale: 3.7,
});
water.rotation.x = -Math.PI / 2;
scene.add(water);

// Light setup
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Camera position
camera.position.set(0, 10, 30);
camera.lookAt(0, 0, 0);

// Mouse movement effect to simulate surfing
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Adjusting wave distortion and size to create a surfing effect based on mouse movement
  water.material.uniforms['distortionScale'].value = 20 + mouseX * 20;
  water.material.uniforms['size'].value = 2 + mouseY * 2;
});

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  water.material.uniforms['time'].value += 0.01; // Slow down the water movement
  renderer.render(scene, camera);
};
animate();
