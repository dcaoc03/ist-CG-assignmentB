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


// Background color

const backgroundColor = 0x79abfc; // Light blue color

// OBJECT DECLARATION

var hook, trolley, upperCrane;

// KEYWORD-CONTROLLED VARIABLES

var theta2 = 0;
var delta1 = 20;
var delta2 = 10;
var changed;

// OBJECT CONSTANTS

    // Claw dimensions
    const clawRadius = 0.7;

    const clawColor = 0xcccccc;

    // Hook dimensions
    const hookBlockRadius = 1.5;
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
    const turntableRadius = 1.5;
    const turntableHeight = 1;

    const turntableColor = 0xff9900;


/*
    +-------------------------------+
    |                               |
    |   OBJECT CREATION FUNCTIONS   |
    |                               |
    +-------------------------------+
*/

function createClaw(obj, x, y, z) {
    'use strict';

    geometry = new THREE.TetrahedronGeometry(clawRadius);
    material = new THREE.MeshBasicMaterial({ color: clawColor, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);

    geometry.applyMatrix4( new THREE.Matrix4().makeRotationAxis( new THREE.Vector3( 1, 0, 1 ).normalize(), Math.PI/3.3 ) );
    geometry.translate(x, y-(1/3)*clawRadius, z);

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
    createClaw(hook, 0, -hookBlockHeight, hookBlockRadius);
    createClaw(hook, 0, -hookBlockHeight, -hookBlockRadius);
    createClaw(hook, hookBlockRadius, -hookBlockHeight, 0);
    createClaw(hook, -hookBlockRadius, -hookBlockHeight, 0);

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

    // Hook Cable creation
    material = new THREE.MeshBasicMaterial({ color: hookCableColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(hookCableRadius, hookCableRadius, delta2);
    geometry.translate(0,-delta2/2-trolleyCarHeight/2,0);
    mesh = new THREE.Mesh(geometry, material);
    trolley.add(mesh);

    // Hook creation
    createHook(trolley, 0, -delta2-trolleyCarHeight/2, 0);

    trolley.position.set(x, y, z);
    obj.add(trolley);
}

function createUpperCrane() {
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

    scene.add(upperCrane);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(backgroundColor); // Light blue color

    axis = new THREE.AxesHelper(10);
    axis.visible = true;

    scene.add(axis);


    createUpperCrane();
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
        window.innerWidth / -40,   // Left
        window.innerWidth / 40,    // Right
        window.innerHeight / 40,   // Top
        window.innerHeight / -40,  // Bottom
        1,                         // Near plane
        100                        // Far plane
    );
    cameraFrontal.position.x = 110; // 25
    cameraFrontal.position.y = 0; // -25
    cameraFrontal.position.z = 0; // 25
    cameraFrontal.lookAt(scene.position);
}

function createCameraLateral() {
    'use strict';
    cameraLateral = new THREE.OrthographicCamera(
        window.innerWidth / -50,   // Left
        window.innerWidth / 50,    // Right
        window.innerHeight / 50,   // Top
        window.innerHeight / -50,  // Bottom
        1,                         // Near plane
        100                        // Far plane
    );
    cameraLateral.position.x = 0;
    cameraLateral.position.y = 0;
    cameraLateral.position.z = 70;
    cameraLateral.lookAt(scene.position);
}
 
function createCameraTopo() {
    'use strict';
    cameraTopo = new THREE.OrthographicCamera(
        window.innerWidth / -40,   // Left
        window.innerWidth / 40,    // Right
        window.innerHeight / 40,   // Top
        window.innerHeight / -40,  // Bottom
        1,                         // Near plane
        100                        // Far plane
    );
    cameraTopo.position.x = 0;
    cameraTopo.position.y = 50;
    cameraTopo.position.z = 0;
    cameraTopo.lookAt(scene.position);
}

function createCameraOrtogonal() {
    'use strict';
    cameraOrtogonal = new THREE.OrthographicCamera(
        window.innerWidth / -40,   // Left
        window.innerWidth / 40,    // Right
        window.innerHeight / 40,   // Top
        window.innerHeight / -40,  // Bottom
        1,                         // Near plane
        100                        // Far plane
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
    cameraPerspetiva.position.x = 30;
    cameraPerspetiva.position.y = 30;
    cameraPerspetiva.position.z = 30;
    cameraPerspetiva.lookAt(scene.position);
}

function createCameraMovel() {
    'use strict';
    cameraMovel = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    cameraMovel.position.x = 30;
    cameraMovel.position.y = 30;
    cameraMovel.position.z = 30;
    cameraMovel.lookAt(scene.position);
}

/*
    +--------------------+
    |                    |
    |   EVENT HANDLERS   |
    |                    |
    +--------------------+
*/

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 65: //A
        case 97: //a
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        case 49: // Tecla '1'
            switchToCameraFrontal();
            break;
        case 50: // Tecla '2'
            switchToCameraLateral();
            break;
        case 51: // Tecla '3'
            switchToCameraTopo();
            break;
        case 52: // Tecla '4'
            switchToCameraOrtogonal();
            break;
        case 53: // Tecla '5'
            switchToCameraPerspetiva();
            break;
        case 54: // Tecla '6'
            switchToCameraMovel();
            break;
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
    createCameraMovel();

    switchToCameraFrontal();
    
    velocity = 0.10;

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    changed = false
}

function animate() {
    'use strict';

    /*if (ball.userData.jumping) {
        ball.userData.step += velocity;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }*/
    if (changed) {
        changed = false;
        //geometry.applyMatrix4( new THREE.Matrix4().makeRotationAxis( new THREE.Vector3( 1, 0, 1 ).normalize(), Math.PI/3 ) );
    }
    render();

    requestAnimationFrame(animate);
}

init();
animate();