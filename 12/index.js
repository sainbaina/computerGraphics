import * as THREE from 'three';

// Инициализация сцены, камеры и рендера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.x = 0;
camera.position.y = -4;
camera.rotateX(Math.PI / 6);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const lightColor = 0xFFFFFF;
const intensity = 150;  // Adjusted intensity for better lighting
const light = new THREE.SpotLight(lightColor, intensity);
light.position.set(5, 5, 5);  // Position the light above and to the side
light.castShadow = true;
scene.add(light);

// Карты и их параметры
const cardWidth = 1.5;
const cardHeight = 2;
const cardDepth = 0.05;
const numPairs = 6;
const cards = [];
let openCards = [];
let isFlipping = false;  // Flag to prevent multiple flips
let isOneOpened = true;

// Функция для создания карты
function createCard(texture, x, y) {
  const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
  const materialFront = new THREE.MeshBasicMaterial({ map: texture });
  const materialBack = new THREE.MeshBasicMaterial({ color: 0x007700 });
  const materials = [materialFront, materialFront, materialFront, materialFront, materialBack, materialFront];
  const card = new THREE.Mesh(geometry, materials);
  card.position.set(x, y, 0);
  card.isFlipped = false;
  card.isMatched = false;
  cards.push(card);
  scene.add(card);
}

// Загрузка текстур карт
const loader = new THREE.TextureLoader();
const textures = [];
for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 13; j++) {
        textures.push(loader.load(`./cards/cards_${i}_${j}.png`));
    }
} 

// Генерация карт на игровом поле
function generateCards() {
  const positions = [];
  for (let i = 0; i < numPairs * 2; i++) {
    positions.push(i);
  }
  positions.sort(() => Math.random() - 0.5);

  for (let i = 0; i < numPairs; i++) {
    const ind = Math.floor(Math.random() * 53);
    const x1 = (positions[i * 2] % 4) * (cardWidth + 0.5) - 3;
    const y1 = Math.floor(positions[i * 2] / 4) * (cardHeight + 0.5) - 2;
    createCard(textures[ind], x1, y1);

    const x2 = (positions[i * 2 + 1] % 4) * (cardWidth + 0.5) - 3;
    const y2 = Math.floor(positions[i * 2 + 1] / 4) * (cardHeight + 0.5) - 2;
    createCard(textures[ind], x2, y2);
  }
}

// Анимация переворота карты
function flipCard(card, onComplete) {
  let angle = 0;
  const flipSpeed = 0.3;  // You can now set this to a higher value without issues

  function flipAnimation() {
    if (angle < Math.PI) {
      const delta = Math.min(flipSpeed, Math.PI - angle);  // Ensure the angle doesn't exceed 180°
      card.rotation.y += delta;
      angle += delta;
      requestAnimationFrame(flipAnimation);
    } else {
      // card.rotation.y = Math.PI;  // Ensure it stops exactly at 180 degrees
      onComplete();  
    }
  }
  flipAnimation();
}

function endTurnUnsucc() {
  if (openCards.length == 1) return;
  // Flip both cards back
  openCards.forEach(card => flipCard(card, () => {}));
  openCards = [];
}

function endTurnSucc() {
  // Remove both cards from the scene
  scene.remove(openCards[0]);
  scene.remove(openCards[1]);
  openCards = [];
}

function waitToShowCards(fit, time) {
  setTimeout(() => {
    if (fit) {
      endTurnSucc();
    } else {
      endTurnUnsucc();
    }
    isFlipping = false;  // Allow clicks again
  }, time);
}

// Обработчик клика на карту
function onCardClick(card) {
  if (isFlipping || openCards.length == 2 || card.isMatched || openCards.includes(card)) return;

  openCards.push(card);
  isFlipping = true;

  flipCard(card, () => {
    if (openCards.length === 2) {
      if (openCards[0].material[0].map.uuid === openCards[1].material[0].map.uuid) {
        openCards[0].isMatched = true;
        openCards[1].isMatched = true;
        waitToShowCards(true, 1000);
      } else {
        waitToShowCards(false, 1000);
      }
    } else {
      isFlipping = false;  // Allow clicking the second card
    }
  });
}

// Обработка событий мыши
window.addEventListener('click', (event) => {
  if (isFlipping) return;

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);
  if (intersects.length > 0) {
    onCardClick(intersects[0].object);
  }
});

// Анимация сцены
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

generateCards();
animate();
