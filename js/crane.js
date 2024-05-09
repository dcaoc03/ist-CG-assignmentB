import * as THREE from 'three';
import { rotate } from 'https://cdn.jsdelivr.net/npm/three@v0.163.0/examples/jsm/nodes/Nodes.js';

/*
    +----------------------------------------+
    |                                        |
    |   VARIABLE AND CONSTANT DECLARATION    |
    |                                        |
    +----------------------------------------+
*/

// GLOBAL VARIABLES (used in several objects)

var camera, cameraFrontal, cameraLateral, cameraTopo, cameraOrtogonal, cameraPerspetiva, cameraMovel;

var scene, renderer;

var geometry, material, mesh;

var axis;

var keys = {};

var animationSteps = 0;

var delta;

const clock = new THREE.Clock();

// Movement velocity

const velocityRetract = new THREE.Vector3(0, -0.05, 0);
const velocityExtend = new THREE.Vector3(0, 0.025, 0);
const velocityS = new THREE.Vector3(-0.1, 0, 0);
const velocityW = new THREE.Vector3(0.1, 0, 0);

// Background color

const backgroundColor = 0x79abfc; // Light blue color

// Active key

var active_key = document.getElementById("active_key_val");
var changingTextActiveKey;

// OBJECT DECLARATION

var claw, hookBlock, hook, trolley, upperCrane, hookCable, claws = [], base;
var container, cube, dodecahedron, icosahedron, torus, torusKnot;
var cubeSphere, dodecahedronSphere, icosahedronSphere, torusSphere, torusKnotSphere;
var cargoes = [];
var spheres = [];
var hookBlockSphere;

// KEYWORD-CONTROLLED VARIABLES

var delta1 = 5;
var delta2 = 10;
var theta1 = 0;

// OBJECT CONSTANTS

    // Claw dimensions
    const clawRadius = 0.7;

    const clawColor = 0xcccccc;

    // Hook dimensions
    const hookBlockRadius = 2;
    const hookBlockHeight = 1;

    const hookBlockColor = 0xffcc00;

    // Hook Cable Dimensions
    const hookCableRadius = 0.25;
    const hookCableHeight = 10;             // initially the same oa delta2

    const hookCableColor = 0x888888;

    // Trolley
    const trolleyCarWidth = 3;
    const trolleyCarHeight = 1;
    const trolleyCarDepth = 2;

    const trolleyCarColor = 0xff9900;

    // Jib
    const jibWidth = 30;
    const jibHeight = 2;
    const jibDepth = 3;

    const jibColor = 0xffcc00;

    // Apex
    const apexWidth = 3;
    const apexHeight = 8;
    const apexDepth = 3;

    const apexColor = 0xffcc00;

    // Counterjib
    const counterjibWidth = 10;
    const counterjibHeight = 2;
    const counterjibDepth = 3;

    const counterjibColor = 0xffcc00;

    // Rear Pendant
    const rearPendantRadius = 0.25;
    const rearPendantHeight = 9;
    const rearPendantAngle = -1.107;

    const rearPendantHeightTranslation = (2*counterjibWidth/5)/(-Math.tan(rearPendantAngle));

    const rearPendantColor = 0x888888;

    // Fore Pendant
    const forePendantRadius = 0.25;
    const forePendantHeight = 21;
    const forePendantAngle = 1.373;

    const forePendantHeightTranslation = (jibWidth/3)/Math.tan(forePendantAngle);
    
    const forePendantColor = 0x888888;

    // Cabin
    const cabinWidth = 4;
    const cabinHeight = 3;
    const cabinDepth = 3;

    const cabinColor = 0x5588ff;

    // Counterweight
    const counterweightWidth = 4;
    const counterweightHeight = 2;
    const counterweightDepth = 3;

    const counterweightColor = 0x666666;

    // Turntable
    const turntableRadius = 1.7;
    const turntableHeight = 1;

    const turntableColor = 0xff9900;

    // Tower
    const towerWidth = 3;
    const towerHeight = 30;
    const towerDepth = 3;

    const towerColor = 0xffcc00;

    // Base
    const baseWidth = 5;
    const baseHeight = 3;
    const baseDepth = 4;

    const baseColor = 0x666666;

    // Container
    const containerWidth = 12;
    const containerHeight = 4;
    const containerDepth = 9;

    const containerColor = 0x00cc00;
    const containerFloorColor = 0x005500;
    const containerPosition = new THREE.Vector3(10, containerHeight/2-baseHeight/2, 0)

    // Objects
    const cubeSide = 2;
    const cubePosition = new THREE.Vector3(8, cubeSide/2-baseHeight/2, -18);
    const cubeColor = 0x000055;

    const dodecahedronRadius = 2;
    const dodecahedronPosition = new THREE.Vector3(-20, dodecahedronRadius/2-baseHeight/2, 3);
    const dodecahedronColor = 0x882233;

    const icosahedronRadius = 1.3;
    const icosahedronPosition = new THREE.Vector3(0, icosahedronRadius/2-baseHeight/2, 12);
    const icosahedronColor = 0x008822;

    const torusRadius = 2;
    const torusTube = 1;
    const torusPosition = new THREE.Vector3(20, torusRadius/2-baseHeight/2, 20);
    const torusColor = 0x880088; 

    const torusKnotRadius = 2;
    const torusKnotTube = 1;
    const torusKnotPosition = new THREE.Vector3(-5, torusKnotRadius/2-baseHeight/2, -10);
    const torusKnotColor = 0xbb7700; 

    // Sphere
    const sphereRadius = 2;
    const sphereColor = 0xFFFFFF;



/*
    +-------------------------------+
    |                               |
    |   OBJECT CREATION FUNCTIONS   |
    |                               |
    +-------------------------------+
*/

function createClaw(obj, x, y, z, rotationAxis) {
    'use strict';

    claw = new THREE.Object3D();

    geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array( [
        -0.5, 0.0,  -0.5, // v0
        0.5, 0.0,  0.0, // v1
        0.0,  0.0,  0.5, // v2
        0.0,  2.0,  0.0, // v3
    ] );

    const indices = [
        0, 2, 3,
        1, 3, 2,
        1, 0, 3,
        0, 1, 2
    ];

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    material = new THREE.MeshBasicMaterial({ color: clawColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);

    // geometry.applyMatrix4( new THREE.Matrix4().makeRotationAxis( new THREE.Vector3( 1, 0, 1 ).normalize(), Math.PI/3.3 ) );
    if (rotationAxis == 'x') {
        if (z > 0)
            geometry.rotateX(5*Math.PI/6);
        else if (z < 0)
            geometry.rotateX(-5*Math.PI/6);
    }
    else if (rotationAxis == 'z') {
        if (x > 0)
            geometry.rotateZ(-5*Math.PI/6);
        else if (x < 0)
            geometry.rotateZ(5*Math.PI/6);
    }
    claw.add(mesh);
    claw.position.set(x, y, z);

    obj.add(claw);
    claws.push(mesh)
}

function createHookBlock(obj, x, y, z) {
    'use strict';

    hookBlock = new THREE.Object3D();

    // 4 Hook Claws creation 
    createClaw(hookBlock, 0, -hookBlockHeight, 2*hookBlockRadius/3, 'x');
    createClaw(hookBlock, 0, -hookBlockHeight, -2*hookBlockRadius/3, 'x');
    createClaw(hookBlock, 2*hookBlockRadius/3, -hookBlockHeight, 0, 'z');
    createClaw(hookBlock, -2*hookBlockRadius/3, -hookBlockHeight, 0, 'z');

    // Hook Block creation
    material = new THREE.MeshBasicMaterial({ color: hookBlockColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(hookBlockRadius, hookBlockRadius, hookBlockHeight);
    geometry.translate(0, -hookBlockHeight/2, 0);
    mesh = new THREE.Mesh(geometry, material);
    hookBlock.add(mesh);

    createCameraMovel();
    hookBlock.add(cameraMovel);
    hookBlock.position.set(x, y, z);
    hookBlockSphere = createSphere();
    hookBlock.add(hookBlockSphere);
    obj.add(hookBlock);
}

function createHook(obj, x, y, z) {
    'use strict';

    hook = new THREE.Object3D();

    // Hook Cable creation
    material = new THREE.MeshBasicMaterial({ color: hookCableColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(hookCableRadius, hookCableRadius, hookCableHeight);
    hookCable = new THREE.Mesh(geometry, material);
    hook.add(hookCable);

    // Hook Block creation
    createHookBlock(hook, 0, -hookCableHeight/2, 0);

    hook.position.set(x, y, z);
    obj.add(hook);
}

function createTrolley(obj, x, y, z) {
    'use strict';

    trolley = new THREE.Object3D();

    // Trolley Car creation
    material = new THREE.MeshBasicMaterial({ color:trolleyCarColor, wireframe: false });
    geometry = new THREE.BoxGeometry(trolleyCarWidth, trolleyCarHeight, trolleyCarDepth);
    trolley.add(new THREE.Mesh(geometry, material));

    // Hook creation
    createHook(trolley, 0, -hookCableHeight/2-trolleyCarHeight/2, 0);

    trolley.position.set(x, y, z);
    obj.add(trolley);
}

function createUpperCrane(obj, x, y, z) {
    'use strict';

    upperCrane = new THREE.Object3D();

    // Jib creation
    material = new THREE.MeshBasicMaterial({ color: jibColor, wireframe: false });
    geometry = new THREE.BoxGeometry(jibWidth, jibHeight, jibDepth);
    geometry.translate(jibWidth/2+apexWidth/2,jibHeight/2+cabinHeight+turntableHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Apex creation
    material = new THREE.MeshBasicMaterial({ color: apexColor, wireframe: false });
    geometry = new THREE.BoxGeometry(apexWidth, apexHeight, apexDepth);
    geometry.translate(0,apexHeight/2+cabinHeight+turntableHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Counterjib creation
    material = new THREE.MeshBasicMaterial({ color: counterjibColor, wireframe: false });
    geometry = new THREE.BoxGeometry(counterjibWidth, counterjibHeight, counterjibDepth);
    geometry.translate(-counterjibWidth/2-apexWidth/2,counterjibHeight/2+cabinHeight+turntableHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);
    
    // Rear Cable creation
    material = new THREE.MeshBasicMaterial({ color: rearPendantColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(rearPendantRadius, rearPendantRadius, rearPendantHeight);
    geometry.rotateZ(rearPendantAngle);
    geometry.translate(-(2*counterjibWidth/5)-apexWidth/2,rearPendantHeightTranslation+counterjibHeight+cabinHeight+turntableHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);
    
    // Fore Cable creation
    material = new THREE.MeshBasicMaterial({ color: forePendantColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(forePendantRadius, forePendantRadius, forePendantHeight);
    geometry.rotateZ(forePendantAngle);
    geometry.translate(jibWidth/3+apexWidth/2,forePendantHeightTranslation+jibHeight+cabinHeight+turntableHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Cabin creation
    material = new THREE.MeshBasicMaterial({ color: cabinColor, wireframe: false });
    geometry = new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinDepth);
    geometry.translate(cabinWidth/2-apexWidth/2,turntableHeight+(cabinHeight/2),0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Counterweight creation
    material = new THREE.MeshBasicMaterial({ color: counterweightColor, wireframe: false });
    geometry = new THREE.BoxGeometry(counterweightWidth, counterweightHeight, counterweightDepth);
    geometry.translate(-counterweightWidth/2-(3*counterjibWidth/5),-counterweightHeight/2+cabinHeight+turntableHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Turntable creation
    material = new THREE.MeshBasicMaterial({ color: turntableColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(turntableRadius, turntableRadius, turntableHeight);
    geometry.translate(0, turntableHeight/2, 0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Trolley creation
    createTrolley(upperCrane, trolleyCarWidth/2+delta1, -trolleyCarHeight/2+cabinHeight+turntableHeight, 0);

    upperCrane.position.set(x, y, z);
    upperCrane.rotation.set(0, 0, 0);

    obj.add(upperCrane);
}

function createCrane() {
    'use strict'

    base = new THREE.Object3D();

    // Tower creation
    material = new THREE.MeshBasicMaterial({ color: towerColor, wireframe: false });
    geometry = new THREE.BoxGeometry(towerWidth, towerHeight, towerDepth);
    geometry.translate(0, towerHeight/2+baseHeight/2, 0);
    mesh = new THREE.Mesh(geometry, material);
    base.add(mesh);

    // Base creation
    material = new THREE.MeshBasicMaterial({ color: baseColor, wireframe: false });
    geometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    mesh = new THREE.Mesh(geometry, material);
    base.add(mesh);

    // Upper crane creation
    createUpperCrane(base, 0, towerHeight+baseHeight/2, 0);

    scene.add(base);
}

function createContainer() {
    'use strict';

    container = new THREE.Object3D();

    const vertices = new Float32Array( [
        containerWidth/2, containerHeight/2,  containerDepth/2, // v0
        containerWidth/2, containerHeight/2,  -containerDepth/2, // v1
        -containerWidth/2, containerHeight/2,  -containerDepth/2, // v2
        -containerWidth/2, containerHeight/2,  containerDepth/2, // v3

        containerWidth/2, -containerHeight/2,  containerDepth/2, // v4
        containerWidth/2, -containerHeight/2,  -containerDepth/2, // v5
        -containerWidth/2, -containerHeight/2,  -containerDepth/2, // v6
        -containerWidth/2, -containerHeight/2,  containerDepth/2, // v7
    ] );

    const floorVertices = new Float32Array( [
        containerWidth/2, -containerHeight/2,  containerDepth/2, // v4
        containerWidth/2, -containerHeight/2,  -containerDepth/2, // v5
        -containerWidth/2, -containerHeight/2,  -containerDepth/2, // v6
        -containerWidth/2, -containerHeight/2,  containerDepth/2, // v7
    ] );

    // Container walls
    const indices = [
        0, 5, 1,    0, 1, 5,
        0, 4, 5,    0, 5, 4,
        1, 5, 6,    1, 6, 5,
        1, 6, 2,    1, 2, 6,
        2, 6, 7,    2, 7, 6,
        2, 7, 3,    2, 3, 7,
        0, 3, 7,    0, 7, 3,
        0, 7, 4,    0, 4, 7
    ];

    geometry = new THREE.BufferGeometry();
    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    material = new THREE.MeshBasicMaterial({ color: containerColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    
    container.add(mesh);

    // Container floor
    const floorIndices = [
        0, 1, 2,    0, 2, 1,
        0, 2, 3,    0, 3, 2
    ]
    geometry = new THREE.BufferGeometry();
    geometry.setIndex( floorIndices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( floorVertices, 3 ) );
    material = new THREE.MeshBasicMaterial({ color: containerFloorColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    
    container.add(mesh);


    container.position.set(containerPosition.x, containerPosition.y, containerPosition.z);
    scene.add(container);
}

function createObjects() {
    'use strict';

    cube = new THREE.Object3D();
    dodecahedron = new THREE.Object3D();
    icosahedron = new THREE.Object3D();
    torus = new THREE.Object3D();
    torusKnot = new THREE.Object3D();

    // Cube creation
    geometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
    material = new THREE.MeshBasicMaterial({ color: cubeColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    cube.add(mesh);
    cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
    cubeSphere = createSphere();
    cube.add(cubeSphere);
    scene.add(cube);

    // Dodecahedron creation
    geometry = new THREE.DodecahedronGeometry(dodecahedronRadius);
    material = new THREE.MeshBasicMaterial({ color: dodecahedronColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    dodecahedron.add(mesh);
    dodecahedron.position.set(dodecahedronPosition.x, dodecahedronPosition.y, dodecahedronPosition.z);
    dodecahedronSphere = createSphere();
    dodecahedron.add(dodecahedronSphere);
    scene.add(dodecahedron);

    // Icosahedron creation
    geometry = new THREE.IcosahedronGeometry(icosahedronRadius);
    material = new THREE.MeshBasicMaterial({ color: icosahedronColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    icosahedron.add(mesh);
    icosahedron.position.set(icosahedronPosition.x, icosahedronPosition.y, icosahedronPosition.z);
    icosahedronSphere = createSphere();
    icosahedron.add(icosahedronSphere);
    scene.add(icosahedron);

    // Torus creation
    geometry = new THREE.TorusGeometry(torusRadius, torusTube);
    material = new THREE.MeshBasicMaterial({ color: torusColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    torus.add(mesh);
    torus.position.set(torusPosition.x, torusPosition.y, torusPosition.z);
    torusSphere = createSphere();
    torus.add(torusSphere);
    scene.add(torus);

    // Torus creation
    geometry = new THREE.TorusGeometry(torusRadius, torusTube);
    material = new THREE.MeshBasicMaterial({ color: torusColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    torus.add(mesh);
    torus.position.set(torusPosition.x, torusPosition.y, torusPosition.z);
    torusSphere = createSphere();
    torus.add(torusSphere);
    scene.add(torus);

    // Torus Knot creation
    geometry = new THREE.TorusKnotGeometry(torusKnotRadius, torusKnotTube);
    material = new THREE.MeshBasicMaterial({ color: torusKnotColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    torusKnot.add(mesh);
    torusKnot.position.set(torusKnotPosition.x, torusKnotPosition.y, torusKnotPosition.z);
    torusKnotSphere = createSphere();
    torusKnot.add(torusKnotSphere);
    scene.add(torusKnot);

}

function createSphere() {
    'use strict';

    var sphere = new THREE.Object3D();
    geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    material = new THREE.MeshBasicMaterial({ color: sphereColor, wireframe: false, transparent: true, opacity: 0 });
    mesh = new THREE.Mesh(geometry, material);
    sphere.add(mesh);
    return sphere;
}

function minus(v1, v2) {
    return new THREE.Vector3().subVectors(v1, v2);
}

function distanceSquared(v1, v2) {
    return minus(v2, v1).lengthSq();
}

function doesItCollide() {
    spheres = [cubeSphere, dodecahedronSphere, icosahedronSphere, torusSphere, torusKnotSphere];
    cargoes = [cube, dodecahedron, icosahedron, torus, torusKnot];
    var index;
    var rSquared;
    var res = false;
    var hookBlockPosition = new THREE.Vector3(), cargoBlockPosition = new THREE.Vector3();
    for (index = 0; index < spheres.length; index++) {
        rSquared = (2*sphereRadius) ** 2;
        hookBlock.getWorldPosition(hookBlockPosition);
        cargoes[index].getWorldPosition(cargoBlockPosition)
        res = distanceSquared(hookBlockPosition, cargoBlockPosition) <= rSquared;
        if (res) {
            cargoes[index].name = "cargo";
            hookBlock.add(cargoes[index]);
            cargoes[index].position.set(0,-hookBlockHeight/2-2,0);
            return res;
        }
    }
    return res;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(backgroundColor); // Light blue color

    axis = new THREE.AxesHelper(10);
    axis.visible = true;

    scene.add(axis);


    createCrane();
    createContainer();
    createObjects();
}

/*
    +----------------------------------------+
    |                                        |
    |                 CAMERAS                |
    |                                        |
    +----------------------------------------+
*/

// Trocar para camera frontal
function switchToCameraFrontal() {
    'use strict';

    camera = cameraFrontal;
}

// Trocar para camera lateral
function switchToCameraLateral() {
    'use strict';

    camera = cameraLateral;
}

// Trocar para camera de topo
function switchToCameraTopo() {
    'use strict';

    camera = cameraTopo;
}

// Trocar para camera ortogonal
function switchToCameraOrtogonal() {
    'use strict';

    camera = cameraOrtogonal;
}

// Trocar para camera perspetiva
function switchToCameraPerspetiva() {
    'use strict';

    camera = cameraPerspetiva;
}

// Trocar para camera Movel
function switchToCameraMovel() {
    'use strict';

    camera = cameraMovel;
}

function createCameraFrontal() {
    'use strict';
    cameraFrontal = new THREE.OrthographicCamera(
        window.innerWidth / -20,   // Left
        window.innerWidth / 20,    // Right
        window.innerHeight / 15,   // Top
        window.innerHeight / -15,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraFrontal.position.x = 90; // 25
    cameraFrontal.position.y = 0; // -25
    cameraFrontal.position.z = 0; // 25
    cameraFrontal.lookAt(0,14,0);
}

function createCameraLateral() {
    'use strict';
    cameraLateral = new THREE.OrthographicCamera(
        window.innerWidth / -30,   // Left
        window.innerWidth / 30,    // Right
        window.innerHeight / 30,   // Top
        window.innerHeight / -30,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraLateral.position.x = 0;
    cameraLateral.position.y = 0;
    cameraLateral.position.z = 150;
    cameraLateral.lookAt(0,20,0);
}
 
function createCameraTopo() {
    'use strict';
    cameraTopo = new THREE.OrthographicCamera(
        window.innerWidth / -20,   // Left
        window.innerWidth / 20,    // Right
        window.innerHeight / 20,   // Top
        window.innerHeight / -20,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraTopo.position.x = 0;
    cameraTopo.position.y = 80;
    cameraTopo.position.z = 0;
    cameraTopo.lookAt(scene.position);
}

function createCameraOrtogonal() {
    'use strict';
    cameraOrtogonal = new THREE.OrthographicCamera(
        window.innerWidth / -20,   // Left
        window.innerWidth / 20,    // Right
        window.innerHeight / 20,   // Top
        window.innerHeight / -20,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraOrtogonal.position.x = 80;
    cameraOrtogonal.position.y = 80;
    cameraOrtogonal.position.z = 80;
    cameraOrtogonal.lookAt(0,20,0);
}

function createCameraPerspetiva() {
    'use strict';
    cameraPerspetiva = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    cameraPerspetiva.position.x = 40;
    cameraPerspetiva.position.y = 50;
    cameraPerspetiva.position.z = 40;
    cameraPerspetiva.lookAt(0,20,0);
}

function createCameraMovel() {
    'use strict';

    cameraMovel = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        2,
        100); 
    cameraMovel.position.x = 0;
    cameraMovel.position.y = -hookBlockHeight/2;
    cameraMovel.position.z = 0;
    cameraMovel.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); 
}

/*
    +--------------------+
    |                    |
    |   EVENT HANDLERS   |
    |                    |
    +--------------------+
*/

function rotateClawsF() {
    'use strict';
     
    if (claws[0].rotation.x < 1) {
        claws[0].rotation.x += 30 * (Math.PI / 180) * delta
        claws[1].rotation.x -= 30 * (Math.PI / 180) * delta
        claws[2].rotation.z -= 30 * (Math.PI / 180) * delta
        claws[3].rotation.z += 30 * (Math.PI / 180) * delta
    }
}

function rotateClawsR() {
    'use strict';

    if (claws[0].rotation.x > 0) {
        claws[0].rotation.x -= 30 * (Math.PI / 180) * delta
        claws[1].rotation.x += 30 * (Math.PI / 180) * delta
        claws[2].rotation.z += 30 * (Math.PI / 180) * delta
        claws[3].rotation.z -= 30 * (Math.PI / 180) * delta
    }
}

function rotateUpperCraneA() {
    'use strict';

    upperCrane.rotation.y += 10 * (Math.PI / 180) * delta;
    theta1 += Math.PI / 180;
}

function rotateUpperCraneQ() {
    'use strict';

    upperCrane.rotation.y -= 10 * (Math.PI / 180) * delta;
    theta1 -= Math.PI / 180;
}

function moveTrolleyS() {
    'use strict';

    if (trolley.position.x > cabinWidth + 0.2) {
        trolley.position.x -= 10 * delta;
        delta1 += velocityS.x;
    }
}

function moveTrolleyW() {
    'use strict';

    if (trolley.position.x < jibWidth) {
        trolley.position.x += 10 * delta;
        delta1 += velocityW.x;
    }
}

function extendCable() {
    'use strict';

    if (delta2 < towerHeight + baseHeight/2) {
        hookCable.scale.y += 5 * delta;
        hookCable.position.y -= (hookCable.scale.y*hookCableHeight-delta2)/2;
        hookBlock.position.y -= (hookCable.scale.y*hookCableHeight-delta2);
        delta2 = hookCable.scale.y*hookCableHeight;
    }
}

function retractCable() {
    'use strict';

    if (delta2 > hookCableHeight) {
        hookCable.scale.y -= 5 * delta;
        hookCable.position.y += (delta2-hookCable.scale.y*hookCableHeight)/2;
        hookBlock.position.y += (delta2-hookCable.scale.y*hookCableHeight);
        delta2 = hookCable.scale.y*hookCableHeight;
    }
}

function toggleWireframe() {
    'use strict';

    var objects = [base, container, cube, dodecahedron, icosahedron, torus, torusKnot];
    for (var index = 0; index < objects.length; index++) {
        objects[index].traverse(function(child) {
            if (child.isMesh) {
               child.material.wireframe = !child.material.wireframe;
            }
        });
    }
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(event) {
    'use strict';

    keys[event.keyCode] = true;
}

function onKeyUp(event) {
    'use strict';

    keys[event.keyCode] = false;
    active_key.textContent = "";
    changingTextActiveKey.style.color = 'white';
}

function update() {
    'use strict';

    delta = clock.getDelta();

    if (keys[49]) { // Tecla '1'
        switchToCameraFrontal();
        active_key.textContent = "1";
        changingTextActiveKey = document.getElementById("toggle_frontal_camera");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[50]) { // Tecla '2'
        switchToCameraLateral();
        active_key.textContent = "2";
        changingTextActiveKey = document.getElementById("toggle_lateral_camera");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[51]) { // Tecla '3'
        switchToCameraTopo();
        active_key.textContent = "3";
        changingTextActiveKey = document.getElementById("toggle_top_camera");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[52]) { // Tecla '4'
        switchToCameraOrtogonal();
        active_key.textContent = "4";
        changingTextActiveKey = document.getElementById("toggle_orthogonal_camera");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[53]) { // Tecla '5'
        switchToCameraPerspetiva();
        active_key.textContent = "5";
        changingTextActiveKey = document.getElementById("toggle_perspective_camera");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[54]) { // Tecla '6'
        switchToCameraMovel();
        active_key.textContent = "6";
        changingTextActiveKey = document.getElementById("toggle_mobile_camera");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[55]) { // Tecla '7'
        toggleWireframe();
        keys[55] = false;
        active_key.textContent = "7";
        changingTextActiveKey = document.getElementById("toggle_wireframe");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[87]) { // Tecla 'W' ou 'w'
        moveTrolleyW();
        active_key.textContent = "W";
        changingTextActiveKey = document.getElementById("move_trolley_forward");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[83]) { // Tecla 'S' ou 's'
        moveTrolleyS();
        active_key.textContent = "S";
        changingTextActiveKey = document.getElementById("move_trolley_back");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[81]) { // Tecla 'Q' ou 'q'
        rotateUpperCraneQ();
        active_key.textContent = "Q";
        changingTextActiveKey = document.getElementById("rotate_crane_clockwise");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[65]) { // Tecla 'A' ou 'a'
        rotateUpperCraneA();
        active_key.textContent = "A";
        changingTextActiveKey = document.getElementById("rotate_crane_counterclockwise");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[69]) { // Tecla 'E' ou 'e'
        extendCable();
        active_key.textContent = "E";
        changingTextActiveKey = document.getElementById("extend_cable");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[68]) { // Tecla 'D' ou 'd'
        retractCable();
        active_key.textContent = "D";
        changingTextActiveKey = document.getElementById("retract_cable");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[82]) { // Tecla 'R' ou 'r'
        rotateClawsR();
        active_key.textContent = "R";
        changingTextActiveKey = document.getElementById("rotate_claws_outward");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
    if (keys[70]) { // Tecla 'F' ou 'f'
        rotateClawsF();
        active_key.textContent = "F";
        changingTextActiveKey = document.getElementById("rotate_claws_inward");
        changingTextActiveKey.style.color = 'LawnGreen';
    }
}

/*
    +----------------------------------------+
    |                                        |
    |   RENDER, INIT AND ANIMATE FUNCTIONS   |
    |                                        |
    +----------------------------------------+
*/



function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    createScene();

    // Criação de cameras
    createCameraFrontal();
    createCameraLateral();
    createCameraTopo();
    createCameraOrtogonal();
    createCameraPerspetiva();

    switchToCameraFrontal();
    
    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

}

function startAnimation() {
    var cargo;

    window.removeEventListener("keydown", onKeyDown);
    for (var index = 0; index < hookBlock.children.length; index++) {
    if (hookBlock.children[index].name === "cargo") {
        cargo = hookBlock.children[index];
        break;
    }
}
    var animation = setInterval(function() {

        if ((delta2 > hookCableHeight) && (animationSteps === 0)) {
            retractCable();
        }
        else {
            animationSteps = 1;
            if (theta1 > 0) {
                rotateUpperCraneQ();
                if (theta1 < 0)
                    theta1 = 0
            }
            else if (theta1 < 0) {
                rotateUpperCraneA();
                if (theta1 > 0)
                    theta1 = 0
            }
            else {
                animationSteps = 2;
                if (delta1 > 10) {
                    moveTrolleyS();
                    if (delta1 < 10) {
                        delta1 = 10;
                    }
                }
                else if (delta1 < 10) {
                    moveTrolleyW();
                    if (delta1 > 10) {
                        delta1 = 10;
                    }
                }
                else {
                    animationSteps = 3;
                    if (delta2 < towerHeight) {
                        extendCable();
                    }
                    else {
                        clearInterval(animation);
                        
                        hookBlock.remove(cargo);

                        container.add(cargo);

                        cargo.position.set(0, 0, 0);

                        if ((delta2 > hookCableHeight) && animationSteps === 3) {
                            retractCable();
                        }
                        else {
                            animationSteps = 0;
                        }
                    }
                }
            }
            }
        }, 1000 / 25);
        window.addEventListener("keydown", onKeyDown);
}

function animate() {
    'use strict';

    update();

    if (doesItCollide()) {
        startAnimation();
    }

    render();

    requestAnimationFrame(animate);
}

init();
animate();