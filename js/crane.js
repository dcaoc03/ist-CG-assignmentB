import * as THREE from 'three';

/*
    +----------------------------------------+
    |                                        |
    |   VARIABLE AND CONSTANT DECLARATION    |
    |                                        |
    +----------------------------------------+
*/

// GLOBAL VARIABLES (used in several objects)

var camera, scene, renderer;

var geometry, material, mesh;

var velocity;

var axis;

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

    const rearPendantHeightTranslation = (rearPendantHeight/2)*(1-Math.cos(rearPendantAngle))-0.5;

    const rearPendantColor = 0x888888;

    // Fore Pendant
    const forePendantRadius = 1;
    const forePendantHeight = 5;
    const forePendantAngle = 8;

    const forePendantColor = 0x888888;


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
    geometry.translate(jibWidth/2+apexWidth/2,jibHeight/2,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Apex creation
    material = new THREE.MeshBasicMaterial({ color: apexColor, wireframe: false });
    geometry = new THREE.BoxGeometry(apexWidth, apexHeight, apexDepth);
    geometry.translate(0,apexHeight/2,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);

    // Counterjib creation
    material = new THREE.MeshBasicMaterial({ color: counterjibColor, wireframe: false });
    geometry = new THREE.BoxGeometry(counterjibWidth, counterjibHeight, counterjibDepth);
    geometry.translate(-counterjibWidth/2-apexWidth/2,counterjibHeight/2,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);
    
    // Rear Cable creation
    material = new THREE.MeshBasicMaterial({ color: rearPendantColor, wireframe: false });
    geometry = new THREE.CylinderGeometry(rearPendantRadius, rearPendantRadius, rearPendantHeight);
    geometry.rotateZ(rearPendantAngle);
    geometry.translate(-counterjibWidth/2,rearPendantHeightTranslation+counterjibHeight,0);
    mesh = new THREE.Mesh(geometry, material);
    upperCrane.add(mesh);


    // Trolley creation
    createTrolley(upperCrane, trolleyCarWidth/2+delta1, -trolleyCarHeight/2, 0);

    scene.add(upperCrane);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    axis = new THREE.AxesHelper(10);
    axis.visible = true;

    scene.add(axis);

    createUpperCrane();
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
    camera.lookAt(scene.position);
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
    case 83:  //S
    case 115: //s
        ball.userData.jumping = !ball.userData.jumping;
        break;
    case 69:  //E
    case 101: //e
        axis.visible = !axis.visible;
        break;
    case 187:
        velocity += 0.01;
        delta2 += 1;
        changed = true;
        break;
    case 189:
        velocity -= 0.01;
        if (velocity < 0)
            velocity = 0;
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
    createCamera();
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