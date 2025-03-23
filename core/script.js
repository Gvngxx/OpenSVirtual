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

const objects = [];
const spawn = {};
const gravity = -0.09;

function spawnObj(name, { position, size, shape, color = 0xFF0000 }) {
  let geometry;
  switch (shape) {
    case "cube":
      geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      break;
    case "triangle":
      geometry = new THREE.ConeGeometry(size.x, size.y, 3);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(size.x / 2, 32, 32);
      break;
    default:
      console.warn("Forma no reconocida");
      return;
  }
  const material = new THREE.MeshStandardMaterial({ color });
  const newObj = new THREE.Mesh(geometry, material);
  newObj.position.set(position.x, position.y, position.z);
  newObj.castShadow = true;
  newObj.velocity = { x: 0, y: 0, z: 0 };
  scene.add(newObj);
  objects.push(newObj);
  spawn[name] = newObj;
}

// Actualizar físicas
function updatePhysics() {
  objects.forEach((obj) => {
    if (obj.position.y > -0.5) {
      obj.velocity.y += gravity;
      obj.position.y += obj.velocity.y;
    } else {
      obj.velocity.y = 0;
      obj.position.y = -0.5;
    }
  });
}

// Posicion de la camara
camera.position.x = 0;
camera.position.y = 0;  // Posicionamos la cámara
camera.position.z = 5;
// Objetos
spawnObj("cubeR", { position: { x: 0, y: 3, z: 0 }, size: { x: 1, y: 1, z: 1 }, shape: "cube", color: 0xFF0000 }); // Añadimos un Cubo

// Función de animación
function render() {
  requestAnimationFrame(render);
  updatePhysics();
  renderer.render(scene, camera);
}

render();
