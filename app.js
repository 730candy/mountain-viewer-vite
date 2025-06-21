import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AmbientLight(0xffffff, 2));

const loader = new GLTFLoader();
loader.load('models/mountain.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.01, 0.01, 0.01);

    model.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.3;
      child.material.depthWrite = false;
    }
  });
  
  scene.add(model);
  console.log('✅ Model loaded');
}, undefined, (error) => {
  console.error('❌ Failed to load model:', error);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
