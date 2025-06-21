import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

document.getElementById('enter-btn').addEventListener('click', () => {
  const intro = document.getElementById('intro-screen');
  const viewer = document.getElementById('main-viewer');

  intro.classList.add('fade-out');

  setTimeout(() => {
    viewer.style.display = 'block';
    setTimeout(() => {
      viewer.style.opacity = '1';

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe0e0ff);

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Lighting for terrain and general environment
      const terrainLight = new THREE.DirectionalLight(0xffffff, 10.0);
      terrainLight.position.set(50, 100, 50);
      scene.add(terrainLight);
      scene.add(new THREE.AmbientLight(0x404040));

      // Separate lighting for frames and 1.jpg
      const frameLight = new THREE.DirectionalLight(0xffffff, 2.5);
      frameLight.position.set(30, 40, -200); // updated position
      scene.add(frameLight);

      const ambientFrameLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientFrameLight);

      const loader = new GLTFLoader();
      loader.load('/models/mountain1.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);

        camera.position.set(center.x, center.y + 50, center.z + 100);
        controls.target.copy(center);
        controls.update();

        model.traverse((child) => {
          if (child.isMesh) {
            const name = child.name.toLowerCase();
            console.log('MESH:', name);

            if (name.includes('projection')) {
              child.material = new THREE.MeshBasicMaterial({
                map: child.material.map,
                transparent: true,
                opacity: 1,
                toneMapped: false
              });
              child.userData.layer = 'painting';
            } else if (name.includes('frame') || name.includes('1.jpg')) {
              child.material = new THREE.MeshStandardMaterial({
                map: child.material.map,
                metalness: 0.4,
                roughness: 0.3
              });
            } else if (name.includes('terrain')) {
              child.material.transparent = true;
              child.material.opacity = 0.5;
              child.material.depthWrite = false;
            }
          }
        });

        document.querySelectorAll('.layer-control').forEach(input => {
          input.addEventListener('change', (e) => {
            const layer = e.target.dataset.layer;
            model.traverse((child) => {
              if (child.userData.layer === layer) {
                child.visible = e.target.checked;
              }
            });
          });
        });
      });

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    }, 50);
  }, 1000);
});
