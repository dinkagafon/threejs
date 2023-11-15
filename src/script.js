import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { generateElements } from './generateDonats';

async function createFontsGroup(material) {
  const textGroup = new THREE.Group();
  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync(
    '/fonts/Shantell Sans SemiBold_Regular.json'
  );

  const textGeometryOptions = {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const firstTextGeometry = new TextGeometry('My first', textGeometryOptions);
  firstTextGeometry.center();
  const firstTextMash = new THREE.Mesh(firstTextGeometry, material);
  firstTextMash.position.y = 0.3;
  textGroup.add(firstTextMash);

  const secondTextGeometry = new TextGeometry('project', textGeometryOptions);
  secondTextGeometry.center();
  const secondTextMash = new THREE.Mesh(secondTextGeometry, material);
  secondTextMash.position.y = -0.4;
  textGroup.add(secondTextMash);

  return textGroup;
}

function createMaterialFromMatcap(path) {
  const matcapTexture = new THREE.TextureLoader().load(path);
  matcapTexture.colorSpace = THREE.SRGBColorSpace;
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  return textMaterial;
}

async function start() {
  const canvas = document.querySelector('canvas.webgl');

  const scene = new THREE.Scene();

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;

  scene.add(camera);

  const textMaterial = createMaterialFromMatcap('/textures/matcaps/11.png');
  const figureMaterial = createMaterialFromMatcap('/textures/matcaps/5.png');

  const fontGroup = await createFontsGroup(textMaterial);
  scene.add(fontGroup);

  const donutGeometry = new THREE.TorusGeometry(0.1, 0.05, 20, 45);
  const donutsGroup = generateElements(
    () => new THREE.Mesh(donutGeometry, figureMaterial)
  );
  scene.add(donutsGroup);

  const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const boxGroup = generateElements(
    () => new THREE.Mesh(boxGeometry, figureMaterial)
  );
  scene.add(boxGroup);

  const sphereGeometry = new THREE.SphereGeometry(0.1);
  const sphereGroup = generateElements(
    () => new THREE.Mesh(sphereGeometry, textMaterial)
  );
  scene.add(sphereGroup);

  scene.background = new THREE.Color('#484652');

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX - sizes.width / 2) / 100;
    cursor.y = (event.clientY - sizes.height / 2) / 100;
  });

  const tick = () => {
    camera.position.x += (cursor.x - camera.position.x) * 0.05;
    camera.position.y += (-cursor.y - camera.position.y) * 0.05;
    camera.lookAt(fontGroup.position);

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}

start();
