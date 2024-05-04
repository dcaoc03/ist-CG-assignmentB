import * as THREE from 'three';

/*
    +----------------------------------------+
    |                                        |
    |   VARIABLE AND CONSTANT DECLARATION    |
    |                                        |
    +----------------------------------------+
*/

// GLOBAL VARIABLES (used in several objects)

var camera, cameraFrontal, cameraLateral, cameraTopo, cameraOrtogonal, cameraPerspetiva, cameraMovel

var scene, renderer;

var geometry, material, mesh;

var velocity;

var axis;

var keys = {};

// Background color

const backgroundColor = 0x79abfc; // Light blue color

// OBJECT DECLARATION

var hook, trolley, upperCrane, hookCable, hook, base;

// KEYWORD-CONTROLLED VARIABLES

var theta2 = 0;
var delta1 = 5;
var delta2 = 10;
var changedTrolleyW;

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



/*
    +-------------------------------+
    |                               |
    |   OBJECT CREATION FUNCTIONS   |
    |                               |
    +-------------------------------+
*/

function createClaw(obj, x, y, z, rotationAxis) {
    'use strict';

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

    geometry.translate(x, y, z);

    obj.add(mesh);
}

function createHook(obj, x, y, z) {
    'use strict';

    hook = new THREE.Object3D();

    // Hook Block creation
    material = new THREE.MeshBasicMaterial({ color: hookBlockColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(hookBlockRadius, hookBlockRadius, hookBlockHeight);
    geometry.translate(0, -hookBlockHeight/2, 0);
    mesh = new THREE.Mesh(geometry, material);
    hook.add(mesh);

    // 4 Hook Claws creation 
    createClaw(hook, 0, -hookBlockHeight, 2*hookBlockRadius/3, 'x');
    createClaw(hook, 0, -hookBlockHeight, -2*hookBlockRadius/3, 'x');
    createClaw(hook, 2*hookBlockRadius/3, -hookBlockHeight, 0, 'z');
    createClaw(hook, -2*hookBlockRadius/3, -hookBlockHeight, 0, 'z');

    createCameraMovel();
    hook.add(cameraMovel);
    hook.position.set(x, y, z);
    obj.add(hook);
}

function createTrolley(obj, x, y, z) {
    'use strict';

    trolley = new THREE.Object3D();
    trolley.userData = { movingW: false, movingS: false, extending: false, retracting: false};

    // Trolley Car creation
    material = new THREE.MeshBasicMaterial({ color:trolleyCarColor, wireframe: false });
    geometry = new THREE.BoxGeometry(trolleyCarWidth, trolleyCarHeight, trolleyCarDepth);
    trolley.add(new THREE.Mesh(geometry, material));

    // Hook Cable creation
    material = new THREE.MeshBasicMaterial({ color: hookCableColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(hookCableRadius, hookCableRadius, delta2);
    geometry.translate(0,-delta2/2-trolleyCarHeight/2,0);
    hookCable = new THREE.Mesh(geometry, material);
    trolley.add(hookCable);

    // Hook creation
    createHook(trolley, 0, -delta2-trolleyCarHeight/2, 0);

    trolley.position.set(x, y, z);
    obj.add(trolley);
}

function createUpperCrane(obj, x, y, z) {
    'use strict';

    upperCrane = new THREE.Object3D();
    upperCrane.userData = { rotatingA: false, rotatingQ: false};

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

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(backgroundColor); // Light blue color

    axis = new THREE.AxesHelper(10);
    axis.visible = true;

    scene.add(axis);


    createCrane();
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
    camera = cameraFrontal;
}

// Trocar para camera lateral
function switchToCameraLateral() {
    camera = cameraLateral;
}

// Trocar para camera de topo
function switchToCameraTopo() {
    camera = cameraTopo;
}

// Trocar para camera ortogonal
function switchToCameraOrtogonal() {
    camera = cameraOrtogonal;
}

// Trocar para camera perspetiva
function switchToCameraPerspetiva() {
    camera = cameraPerspetiva;
}

// Trocar para camera Movel
function switchToCameraMovel() {
    camera = cameraMovel;
}

function createCameraFrontal() {
    'use strict';
    cameraFrontal = new THREE.OrthographicCamera(
        window.innerWidth / -30,   // Left
        window.innerWidth / 30,    // Right
        window.innerHeight / 30,   // Top
        window.innerHeight / -30,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraFrontal.position.x = 110; // 25
    cameraFrontal.position.y = 0; // -25
    cameraFrontal.position.z = 0; // 25
    cameraFrontal.lookAt(scene.position);
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
    cameraLateral.position.z = 70;
    cameraLateral.lookAt(scene.position);
}
 
function createCameraTopo() {
    'use strict';
    cameraTopo = new THREE.OrthographicCamera(
        window.innerWidth / -30,   // Left
        window.innerWidth / 30,    // Right
        window.innerHeight / 30,   // Top
        window.innerHeight / -30,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraTopo.position.x = 0;
    cameraTopo.position.y = 50;
    cameraTopo.position.z = 0;
    cameraTopo.lookAt(scene.position);
}

function createCameraOrtogonal() {
    'use strict';
    cameraOrtogonal = new THREE.OrthographicCamera(
        window.innerWidth / -30,   // Left
        window.innerWidth / 30,    // Right
        window.innerHeight / 30,   // Top
        window.innerHeight / -30,  // Bottom
        1,                         // Near plane
        200                        // Far plane
    );
    cameraOrtogonal.position.x = 50;
    cameraOrtogonal.position.y = 50;
    cameraOrtogonal.position.z = 50;
    cameraOrtogonal.lookAt(scene.position);
}

function createCameraPerspetiva() {
    'use strict';
    cameraPerspetiva = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    cameraPerspetiva.position.x = 35;
    cameraPerspetiva.position.y = 35;
    cameraPerspetiva.position.z = 35;
    cameraPerspetiva.lookAt(scene.position);
}

function createCameraMovel() {
    cameraMovel = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        100); 
    cameraMovel.position.x = 0;
    cameraMovel.position.y = -hookBlockHeight/2;
    cameraMovel.position.z = 0;
    cameraMovel.rotation.set(-Math.PI / 2, 0, 0); 
}

/*
    +--------------------+
    |                    |
    |   EVENT HANDLERS   |
    |                    |
    +--------------------+
*/


function rotateUpperCraneA() {
    upperCrane.rotation.y += Math.PI / 180;
}

function rotateUpperCraneQ() {
    upperCrane.rotation.y -= Math.PI / 180;
}

function moveTrolleyS() {
    // For some reason cabinWidth != actualCabinWidth
    if (trolley.position.x > cabinWidth + 0.2) {
        trolley.position.x -= 0.1
    }
}

function moveTrolleyW() {
    if (trolley.position.x < jibWidth) {
        trolley.position.x += 0.1
    }
}

function extendCable() {
    // TODO: change 50 to crane height
    if (hookCable.scale.y < 50) {
        hookCable.scale.y += 0.01
    }
}

function retractCable() {
    if (hookCable.scale.y > 0) {
        hookCable.scale.y -= 0.01
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
    keys[event.keyCode] = true;
}

function onKeyUp(event) {
    keys[event.keyCode] = false;
}

function update() {
    if (keys[49]) { // Tecla '1'
        switchToCameraFrontal();
    }
    if (keys[50]) { // Tecla '2'
        switchToCameraLateral();
    }
    if (keys[51]) { // Tecla '3'
        switchToCameraTopo();
    }
    if (keys[52]) { // Tecla '4'
        switchToCameraOrtogonal();
    }
    if (keys[53]) { // Tecla '5'
        switchToCameraPerspetiva();
    }
    if (keys[54]) { // Tecla '6'
        switchToCameraMovel();
    }
    if (keys[87]) { // Tecla 'W' ou 'w'
        moveTrolleyW();
    }
    if (keys[83]) { // Tecla 'S' ou 's'
        moveTrolleyS();
    }
    if (keys[81]) { // Tecla 'Q' ou 'q'
        rotateUpperCraneQ();
    }
    if (keys[65]) { // Tecla 'A' ou 'a'
        rotateUpperCraneA();
    }
    if (keys[69]) { // Tecla 'E' ou 'e'
        extendCable();
    }
    if (keys[68]) { // Tecla 'D' ou 'd'
        retractCable();
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
    
    velocity = 0.10;

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    changedTrolleyW = false
}

function animate() {
    'use strict';

    update();

    render();

    requestAnimationFrame(animate);
}

init();
animate();