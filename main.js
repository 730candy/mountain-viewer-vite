import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const colorWheelScreen = document.getElementById('color-wheel-screen');
const introScreen = document.getElementById('intro-screen');
const mainViewer = document.getElementById('main-viewer');
const enterButton = document.getElementById('enter-btn');

const hotspots = {
  blue: document.getElementById('color-hotspot-blue'),
  red: document.getElementById('color-hotspot-red'),
  changbai: document.getElementById('color-hotspot-changbai'),
  mountain: document.getElementById('color-wheel-hotspot-mountain'),
};

const infos = {
  blue: document.getElementById('info-blue'),
  red: document.getElementById('info-red'),
  changbai: document.getElementById('info-changbai'),
  mountain: document.getElementById('info-mountain'),
};

const infoText = {
  blue: `Paektu Mountain or Baekdu Mountain (Korean: 백두산) is an active stratovolcano on the Chinese–North Korean border.[3] In China, it is known as Changbai Mountain (Chinese: 长白山). At 2,744 m (9,003 ft), it is the tallest mountain in North Korea and Northeast China and the tallest mountain of the Baekdu-daegan and Changbai mountain ranges. The highest peak, called Janggun Peak, belongs to North Korea. The mountain notably has a caldera that contains a large crater lake called Heaven Lake, and is also the source of the Songhua, Tumen, and Yalu rivers. Korean and Manchu people assign a mythical quality to the mountain and its lake, and consider the mountain to be their ancestral homeland.`,
  red: `Paektu Mountain or Baekdu Mountain (Korean: 백두산) is an active stratovolcano on the Chinese–North Korean border.[3] In China, it is known as Changbai Mountain (Chinese: 长白山). At 2,744 m (9,003 ft), it is the tallest mountain in North Korea and Northeast China and the tallest mountain of the Baekdu-daegan and Changbai mountain ranges. The highest peak, called Janggun Peak, belongs to North Korea. The mountain notably has a caldera that contains a large crater lake called Heaven Lake, and is also the source of the Songhua, Tumen, and Yalu rivers. Korean and Manchu people assign a mythical quality to the mountain and its lake, and consider the mountain to be their ancestral homeland.`,
  changbai: `The Changbai Mountains (simplified Chinese: 长白山; traditional Chinese: 長白山; lit. 'long white mountain') are a major mountain range in East Asia that extends from the Northeast Chinese provinces of Heilongjiang, Jilin and Liaoning, across the China-North Korea border (41°41' to 42°51'N; 127°43' to 128°16'E), to the North Korean provinces of Ryanggang and Chagang. They are also referred to as the Šanggiyan Mountains in the Manchu language, or the Great Paekdu in Korean. Most of its peaks exceed 2,000 m (6,600 ft) in height, with the tallest summit being Paektu Mountain at 2,744 m (9,003 ft), which contains the Heaven Lake, the highest volcanic crater lake in the world at a surface elevation of 2,189.1 m (7,182 ft). The protected area Longwanqun National Forest Park is located within the vicinity of the mountain range.`,
  mountain: `Click to proceed to the introduction page.`,
};

function showInfo(type) {
  const hotspot = hotspots[type];
  const info = infos[type];
  info.textContent = infoText[type];
  info.style.opacity = '1';

  switch(type) {
    case 'blue': info.style.color = 'blue'; break;
    case 'red': info.style.color = 'red'; break;
    case 'changbai': info.style.color = 'goldenrod'; break;
    case 'mountain': info.style.color = 'black'; break;
    default: info.style.color = 'black';
  }

  const rect = hotspot.getBoundingClientRect();
  let left = rect.right + 10;
  let top = rect.top;

  if (left + info.offsetWidth > window.innerWidth) {
    left = rect.left - info.offsetWidth - 10;
  }
  if (top + info.offsetHeight > window.innerHeight) {
    top = window.innerHeight - info.offsetHeight - 10;
  }

  info.style.left = `${left}px`;
  info.style.top = `${top}px`;
}

function hideInfo(type) {
  infos[type].style.opacity = '0';
}

Object.keys(hotspots).forEach((type) => {
  hotspots[type].addEventListener('mouseenter', () => showInfo(type));
  hotspots[type].addEventListener('mouseleave', () => hideInfo(type));
});

hotspots.mountain.addEventListener('click', () => {
  colorWheelScreen.style.display = 'none';
  introScreen.classList.add('visible');
});

enterButton.addEventListener('click', () => {
  introScreen.classList.remove('visible');
  introScreen.classList.add('fade-out');
  setTimeout(() => {
    introScreen.style.display = 'none';
    mainViewer.classList.add('visible');
    init3DViewer();
  }, 1000);
});

function init3DViewer() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0ff);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lighting only for terrain/environment - no separate lights for paintings/frames
  const terrainLight = new THREE.DirectionalLight(0xffffff, 10.0);
  terrainLight.position.set(50, 100, 50);
  scene.add(terrainLight);
  scene.add(new THREE.AmbientLight(0x404040));

  const loader = new GLTFLoader();
  loader.load('/models/mountain3.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    camera.position.set(center.x, center.y + 50, center.z + 100);
    controls.target.copy(center);
    controls.update();

// ...rest of your code above

model.traverse((child) => {
  if (child.isMesh) {
    const name = child.name.toLowerCase();
    console.log('MESH:', name);

    if (name.includes('projection')) {
      // Projection with multiply blending, unlit
      child.material = new THREE.MeshBasicMaterial({
        map: child.material.map,
        transparent: true,
        opacity: 1,
        toneMapped: false,
        blending: THREE.MultiplyBlending,
        depthWrite: false,
      });
      // Assign projection to painter layer for toggling
      if (name.includes('imsonghee')) child.userData.layer = 'imsonghee';
      else if (name.includes('jangjaesik')) child.userData.layer = 'jangjaesik';
      else if (name.includes('wangqinghuai')) child.userData.layer = 'wangqinghuai';
      else child.userData.layer = 'projection'; // fallback
      child.visible = true;

    } else if (
      name.includes('frame')
    ) {
      // Frames: MeshStandardMaterial with gold color for shiny effect
      child.material = new THREE.MeshStandardMaterial({
        map: child.material.map,
        color: 0xffd700, // Gold color
        metalness: 1,
        roughness: 0.5,
        transparent: true,
      });
      // Assign frame to artist layer based on name (if possible)
      if (name.includes('imsonghee')) child.userData.layer = 'imsonghee';
      else if (name.includes('jangjaesik')) child.userData.layer = 'jangjaesik';
      else if (name.includes('wangqinghuai')) child.userData.layer = 'wangqinghuai';
      else child.userData.layer = 'frame';
      child.visible = true;

    } else if (
      name.includes('imsonghee') ||
      name.includes('jangjaesik') ||
      name.includes('wangqinghuai')
    ) {
      // Paintings as unlit MeshBasicMaterial (to preserve true colors)
      child.material = new THREE.MeshBasicMaterial({
        map: child.material.map,
        transparent: true,
      });
      if (name.includes('imsonghee')) child.userData.layer = 'imsonghee';
      else if (name.includes('jangjaesik')) child.userData.layer = 'jangjaesik';
      else if (name.includes('wangqinghuai')) child.userData.layer = 'wangqinghuai';
      else if (name.includes('frame')) child.userData.layer = 'frame';
      else child.userData.layer = 'painting';
      child.visible = true;

    } else if (name.includes('terrain')) {
      // Terrain: normal shading and transparency
      child.material.transparent = true;
      child.material.opacity = 0.5;
      child.material.depthWrite = false;
      child.userData.layer = 'terrain';
      child.visible = true;
    }
  }
});


    // Create UI for painter toggles (checkboxes)
    const layerToggleContainer = document.createElement('div');
    layerToggleContainer.className = 'layer-toggle';
    layerToggleContainer.style.position = 'absolute';
    layerToggleContainer.style.top = '10px';
    layerToggleContainer.style.left = '10px';
    layerToggleContainer.style.background = 'rgba(255, 255, 255, 0.9)';
    layerToggleContainer.style.padding = '10px';
    layerToggleContainer.style.borderRadius = '8px';
    layerToggleContainer.style.fontSize = '14px';
    layerToggleContainer.style.zIndex = '20';

    const painters = [
      { label: 'Im Song Hee', layer: 'imsonghee' },
      { label: 'Jang Jae Sik', layer: 'jangjaesik' },
      { label: 'Wang Qinghuai', layer: 'wangqinghuai' },
    ];

    painters.forEach((painter) => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '6px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.className = 'layer-control';
      checkbox.dataset.layer = painter.layer;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + painter.label));
      layerToggleContainer.appendChild(label);
    });

    document.body.appendChild(layerToggleContainer);

    // Toggle visibility by checkboxes
    document.querySelectorAll('.layer-control').forEach((input) => {
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

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
