// main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// DOM Elements
const mapScreen = document.getElementById('map-screen');
const mapImage = document.getElementById('map-image');
const introScreen = document.getElementById('intro-screen');
const enterButton = document.getElementById('enter-btn');
const colorWheelScreen = document.getElementById('color-wheel-screen');
const mainViewer = document.getElementById('main-viewer');
const viewerNote = document.getElementById('viewer-note');

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

// 1. Scroll to center of map image on load
window.addEventListener('load', () => {
  const scrollToMiddle = () => {
    const scrollTo = mapImage.offsetHeight / 2 - window.innerHeight / 2;
    mapScreen.scrollTop = scrollTo;
  };
  if (mapImage.complete) scrollToMiddle();
  else mapImage.onload = scrollToMiddle;
});

// 2. Click on map screen => show intro screen
mapScreen.addEventListener('click', () => {
  mapScreen.classList.add('fade-out');
  setTimeout(() => {
    mapScreen.style.display = 'none';
    introScreen.classList.add('visible');
  }, 1000);
});

// 3. Click on Enter => show color wheel
enterButton.addEventListener('click', () => {
  introScreen.classList.remove('visible');
  introScreen.classList.add('fade-out');
  setTimeout(() => {
    introScreen.style.display = 'none';
    colorWheelScreen.style.display = 'block';
  }, 1000);
});

// 4. Click on Mountain hotspot => show 3D viewer
hotspots.mountain.addEventListener('click', () => {
  colorWheelScreen.style.display = 'none';
  mainViewer.classList.add('visible');
  if (viewerNote) viewerNote.style.display = 'block';
  init3DViewer();
});

// Tooltip behavior
function showInfo(type) {
  const hotspot = hotspots[type];
  const info = infos[type];
  info.textContent = infoText[type];
  info.style.opacity = '1';
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


// Dummy artistInfo to avoid error
const artistInfo = {
  imsonghee: {
    name: 'Im Song Hee',
    bio: `
      <p><strong>Title:</strong> Baekdusan (백두산)</p>
      <p><strong>Date:</strong> 1997</p>
      <p>The painting above is contemporary traditional landscape depiction of Baekdusan Lake by South Korean artist Im Song Hee. It was featured in the exhibition 'Painting and Imagining Baekdu Mountains' in South Korea, which explored the theme of the sacred mountains of Korean nation, captured on canvas, through works by multiple artists. The paintings were drawn to grieve the division between the North and South and reminds of the value as symbolic mountain of the nation. Based on the geographical feature visible in the painting, the approximate direction of the artist's perspective was estimated and then projected onto the 3D model of the mountain. It is supposed that the vantage point corresponds to Chinese side of the mountain, looking southward over the lake towards the North Korean side. Such orientation is not purely upon the artist’s will but guided within the range of geopolitical force. The perspective informs of the physical inaccessibility to North Korean territory that it can only be gazed upon from Chinese side. The faint ridge lines visible in the distance symbolically reflect the unreachable territory that was once shared. The affective territory that the artist is perceiving is, ironically, diverged into two different nations where the bodily experienced territory is China while the visual memory roots in North Korean territory. Eventually, the painting as an archive feed into collective memory in constructing how The Mountain is pictured in the culture.</p>
      <p>The collective memory is constructed by primary source (embodied experience of individual or eyewitness), secondary resource (archives, written records, and cultural representations of places); primary source transmitted to the group in the form of secondary resource. As Erll and Rigney (2006) explain, “the memories that are shared within generations and across different generations are the product of public acts of remembrance using a variety of media. Stories, both oral and written, images, museums, monuments: these all work together in creating and sustaining ‘sites of memory’”. And the knowledge obtained from secondary resources, in return, becomes a foundation in shaping the bodily experience of how individuals perceive and engage with space (primary resources). Thus, collective memory is an ongoing process constantly being updated by the contribution who both draw from and add the group's shared memory landscape.</p>
    `
  },
  jangjaesik: {
    name: 'Jang Jae Sik',
    bio: `
      <p><strong>Title:</strong> Heaven Lake in July (7월의 백두산 천지)</p>
      <p><strong>Date:</strong> 1996</p>
      <p>The painting is Heaven Lake at the summit of The Mountain by North Korean artist, Jang Jae Sik. In the painting itself, the border is not apparent. However, when projected on to the 3D model, the legal political boundary running across Heaven Lake becomes visible. The foreground depicted lies in North Korean territory, while the background stretches across into Chinese territory, revealing how visual representations obscure geopolitical division.</p>
    `
  },
  wangqinghuai: {
    name: 'Wang Qinghuai',
    bio: `
      <p><strong>Title:</strong> Lin Hai Zhaohui (林海朝晖)</p>
      <p><strong>Date:</strong> 1974</p>
      <p>The painting in the upper frame is a Chinese propaganda poster by Wang Qinghuai, depicting Changbai Shan in the far distance. As the artist is one of the notable figures in Jilin Province, and the artwork was exhibited as part of the Changbai Mountain exhibition, this piece presumably would have been painted from a local vantage point within Jilin, gazing towards The Mountain from within the region's lived landscape. Using the prominent gorge running down the slope on the right as a spatial reference, the perspective can be geographically estimated. The Mountain's appearance in the distance background, rather than as a central subject, suggests its regular visibility as part of the everyday surroundings. This kind of compositional framing reflects emotional intimacy that develops not only from dwelling within a place, but from seeing it regularly, embedded within the spatial rhythms of daily life. Unlike portrayals that isolate the mountain as an iconic or sacred summit, this image positions Changbai Shan as interwoven in the local life.</p>
    `
  }
};

// === 3D VIEWER ===
function init3DViewer() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0ff);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const terrainLight = new THREE.DirectionalLight(0xffffff, 10.0);
  terrainLight.position.set(50, 100, 50);
  scene.add(terrainLight);
  scene.add(new THREE.AmbientLight(0x404040));

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const loader = new GLTFLoader();
  loader.load('/models/mountain3.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);

    const layers = {
      imsonghee: [],
      jangjaesik: [],
      wangqinghuai: [],
    };

    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    camera.position.set(center.x, center.y + 50, center.z + 100);
    controls.target.copy(center);
    controls.update();

    model.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();

        if (name.includes('imsonghee')) child.userData.layer = 'imsonghee';
        else if (name.includes('jangjaesik')) child.userData.layer = 'jangjaesik';
        else if (name.includes('wangqinghuai')) child.userData.layer = 'wangqinghuai';
        else if (name.includes('projection')) child.userData.layer = 'projection';
        else if (name.includes('terrain')) child.userData.layer = 'terrain';
        else child.userData.layer = 'misc';

        if (layers[child.userData.layer]) {
          layers[child.userData.layer].push(child);
        }

        if (name.includes('projection')) {
          child.material = new THREE.MeshBasicMaterial({
            map: child.material.map,
            transparent: true,
            opacity: 1,
            toneMapped: false,
            blending: THREE.MultiplyBlending,
            depthWrite: false,
          });
          child.userData.clickable = false;
        } else if (name.includes('frame')) {
          child.material = new THREE.MeshStandardMaterial({
            map: child.material.map,
            color: 0xffd700,
            metalness: 1,
            roughness: 0.5,
            transparent: true,
          });
          child.userData.clickable = false;
        } else if (
          name.includes('imsonghee') ||
          name.includes('jangjaesik') ||
          name.includes('wangqinghuai')
        ) {
          child.material = new THREE.MeshBasicMaterial({
            map: child.material.map,
            transparent: true,
          });
          child.userData.clickable = true;
        } else if (name.includes('terrain')) {
          child.material.transparent = true;
          child.material.opacity = 0.5;
          child.material.depthWrite = false;
          child.userData.clickable = false;
        } else {
          child.userData.clickable = false;
        }
      }
    });

    document.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(model.children, true);

      for (let intersect of intersects) {
        const obj = intersect.object;
        const layer = obj.userData.layer;

        if (obj.userData.clickable && artistInfo[layer]) {
          document.getElementById('artist-name').textContent = artistInfo[layer].name;
          document.getElementById('artist-bio').innerHTML = artistInfo[layer].bio;
          document.getElementById('artist-info-modal').classList.remove('hidden');
          break;
        }
      }
    });

    document.getElementById('modal-close').addEventListener('click', () => {
      document.getElementById('artist-info-modal').classList.add('hidden');
    });

    document.querySelectorAll('.layer-control').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const layer = e.target.dataset.layer;
        const visible = e.target.checked;
        if (layers[layer]) {
          layers[layer].forEach((obj) => (obj.visible = visible));
        }
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
