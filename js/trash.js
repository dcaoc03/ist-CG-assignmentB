//function onKeyDown(e) {
//    'use strict';
//
//    switch (e.keyCode) {
//        //case 65: //A
//        //case 97: //a
//        //    scene.traverse(function (node) {
//        //        if (node instanceof THREE.Mesh) {
//        //            node.material.wireframe = !node.material.wireframe;
//        //        }
//        //    });
//        //    break;
//        case 49: // Tecla '1'
//            switchToCameraFrontal();
//            break;
//        case 50: // Tecla '2'
//            switchToCameraLateral();
//            break;
//        case 51: // Tecla '3'
//            switchToCameraTopo();
//            break;
//        case 52: // Tecla '4'
//            switchToCameraOrtogonal();
//            break;
//        case 53: // Tecla '5'
//            switchToCameraPerspetiva();
//            break;
//        case 54: // Tecla '6'
//            switchToCameraMovel();
//            break;
//        case 87: // Tecla 'W' e 'w'
//            trolley.userData.movingW = true;
//            break;
//        case 83: // Tecla 'S' e 's'
//            trolley.userData.movingS = true;
//            break;
//        case  81: // Tecla 'Q' e 'q'
//            upperCrane.userData.rotatingQ = true; 
//            break;
//        case 65: // Tecla 'A' e 'a'
//            upperCrane.userData.rotatingA = true;
//            break;
//        case  69: // Tecla 'E' e 'e'
//            trolley.userData.extending = true; 
//            break;
//        case 68: // Tecla 'D' e 'd'
//            trolley.userData.retracting = true;
//            break;
//    }
//}

//function update() {
//    if (trolley.userData.movingW) {
//        moveTrolleyW();
//    }
//    if (trolley.userData.movingS) {
//        moveTrolleyS();
//    }
//    if (upperCrane.userData.rotatingA) {
//        rotateUpperCraneA();
//    }
//    if (upperCrane.userData.rotatingQ) {
//        rotateUpperCraneQ();
//    }
//    if (trolley.userData.extending) {
//        extendCable();
//    }
//    if (trolley.userData.retracting) {
//        retractCable();
//    }
//}
