// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

window.addEventListener("resize", () => {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Seleccionar el contenedor donde irá el renderizador
const container = document.getElementById("three-container");

// Crear el renderizador y configurar su tamaño al div
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
renderer.setClearColor(0xADD8E6, 1);
renderer.shadowMap.enabled = true; // Habilitar sombras

// Agregar el canvas al contenedor
container.appendChild(renderer.domElement);

// Agregar una luz ambiental para mejor visibilidad
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Agregar una luz direccional con sombras
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true; // Habilitar sombras en la luz
scene.add(directionalLight);

// Configurar sombras en la luz direccional
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Crear el plano receptor de sombras
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true; // Habilitar recepción de sombras
scene.add(plane);

// Crear el cubo con sombras
defineMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true; // Habilitar sombras en el cubo
scene.add(cube);

// Posicion de los objetos
camera.position.x = 0;
camera.position.y = 0;  // Posicionamos la cámara
camera.position.z = 5;

// Función de animación
function render() {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

render();

