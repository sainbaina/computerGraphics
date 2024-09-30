import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 1.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Enable shadow maps in the renderer
document.body.appendChild(renderer.domElement);

const materialStick = new THREE.MeshPhongMaterial({ color: "Brown" });
const geometry = new THREE.BoxGeometry(3, 0.1, 0.1);
const cube = new THREE.Mesh(geometry, materialStick);
cube.position.y = 1;
cube.position.z = 0.3;
cube.castShadow = true;  // Enable casting shadows for the cube
scene.add(cube);

const materialEye = new THREE.MeshPhongMaterial({ color: "Black" });
const geometry1 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cube1 = new THREE.Mesh(geometry1, materialEye);
cube1.position.y = 2.2;
cube1.position.x = 0.45;
cube1.position.z = 0.6;
scene.add(cube1);

const cube2 = new THREE.Mesh(geometry1, materialEye);
cube2.position.y = 2.2;
cube2.position.x = -0.45;
cube2.position.z = 0.6;
scene.add(cube2);

const material2 = new THREE.MeshStandardMaterial({
    color: 0xfb9403,
    emissive: 0x111111,
    specular: 0xffffff,
    metalness: 1,
    roughness: 0.55,
    });

const material3 = new THREE.MeshNormalMaterial();

const myConeGeometry = new THREE.ConeGeometry(0.2, 1, 20);
const cone = new THREE.Mesh(myConeGeometry, material2);
cone.position.y = 1.8;
cone.position.z = 0.9;
cone.rotation.x = 90;
cone.castShadow = true;  // Enable casting shadows for the cone
scene.add(cone);

const materialBucket = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive:0x111111,
    specular: 0xffffff,
    metalness: 1,
    roughness: 0.55,
    });

const cylinder = new THREE.CylinderGeometry(0.4, 0.5, 0.7, 30);
const bucket = new THREE.Mesh(cylinder, materialBucket);
bucket.position.y = 2.9;
bucket.position.z = 0.6;
bucket.rotation.x = 4.5;
bucket.castShadow = true;  // Enable casting shadows for the cone
bucket.rotateX(90);
scene.add(bucket);

const torGeometry = new THREE.TorusGeometry(0.5, 0.05, 10, 10, Math.PI);
const tor3 = new THREE.Mesh(torGeometry, materialBucket);
tor3.position.y = 2.6;
tor3.position.z = 0.6;
tor3.rotation.x = Math.PI / 2.8;  // Use radians for rotation
tor3.castShadow = true;  // Enable casting shadows for the torus
scene.add(tor3);

const myTorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 10);
const tor = new THREE.Mesh(myTorGeometry, material3);
tor.position.y = 1.5;
tor.position.z = 0.8;
tor.rotation.x = Math.PI / 2.8;  // Use radians for rotation
tor.castShadow = true;  // Enable casting shadows for the torus
scene.add(tor);

const tor1 = new THREE.Mesh(myTorGeometry, material3);
tor1.position.y = 0.65;
tor1.position.z = 0.8;
tor1.rotation.x = Math.PI / 2.8;  // Use radians for rotation
tor1.castShadow = true;  // Enable casting shadows for the torus
scene.add(tor1);

const tor2 = new THREE.Mesh(myTorGeometry, material3);
tor2.position.y = 1.1;
tor2.position.z = 0.9;
tor2.rotation.x = Math.PI / 2;  // Use radians for rotation
tor2.castShadow = true;  // Enable casting shadows for the torus
scene.add(tor2);

const material1 = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
const myPlaneGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(myPlaneGeometry, material1);
plane.receiveShadow = true;  // Enable receiving shadows for the plane
plane.rotation.x = -Math.PI / 2;  // Rotate the plane to lay flat
plane.position.y = -1;  // Adjust plane position
scene.add(plane);

const lightColor = 0xFFFFFF;
const intensity = 150;  // Adjusted intensity for better lighting
const light = new THREE.SpotLight(lightColor, intensity);
light.position.set(5, 5, 5);  // Position the light above and to the side
light.castShadow = true;
scene.add(light);

const lightColor1 = 0xFFFF00;
const intensity1 = 100;  // Adjusted intensity for better lighting
const light1 = new THREE.SpotLight(lightColor1, intensity1);
light1.position.set(-5, 5, 0);  // Position the light above and to the side
light1.castShadow = true;
scene.add(light1);

light1.shadow.mapSize.width = 5000;
light1.shadow.mapSize.height = 5000;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

for (let i = 0; i < 3; i++) {
    const sphereGeometry = new THREE.SphereGeometry(1/(i*0.2+1), 32, 32);  // Radius 1, 32 segments for smoother sphere
    const sphere = new THREE.Mesh(sphereGeometry, material1);  // Using the same material as others
    sphere.position.set(0, i*1.1, 0);  // Position the sphere at (0, -1, 0)
    sphere.castShadow = true;  // Enable casting shadows for the sphere
    scene.add(sphere);
}



