'use strict';

import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import {createModel} from './floorplan';



var scene, camera, renderer, controls;

// add floorplan
var floorplan = {
  points: [
    {x: 0, y: 0, id: 0},
    {x: 0, y: 400, id: 1},
    {x: 500, y: 0, id: 2},
    {x: 500, y: 200, id: 3}
  ],

  lines: [
    {from: 0, to: 1},
    {from: 0, to: 2},
    {from: 2, to: 3}
  ]
};

export function init () {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new (OrbitControls(THREE))(camera);


  var floorplanModel = createModel(floorplan);
  scene.add(floorplanModel);

  document.body.appendChild(renderer.domElement);

  animate();
}

function animate () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}, false);