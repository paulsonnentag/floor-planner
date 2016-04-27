'use strict';

import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import {createModel} from './floorplan';



var scene, camera, renderer, controls;
var currSelected, mouseActive;
var lastColor;
var mouse = {x:0, y:0};


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

  _.each(floorplanModel.points, (box) => scene.add(box));
  scene.add(floorplanModel.lines);

  document.body.appendChild(renderer.domElement);

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousemove", onMouseMove);

  animate();
}

function onMouseUp(event) {
  deactivateDD();
}

function onMouseMove(event) {
  moveSelected();
}

function onMouseDown(event) {
  handleClick();
}

function moveSelected() {
  var raycaster = getRayCaster();
  var vec = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)));

  if(currSelected && vec && mouseActive) {
    currSelected.position.copy(vec);
  }
}

function deactivateDD() {
  controls.enabled = true;
  mouseActive = false;
}

function handleClick() {
  mouseActive = true;
  var raycaster = getRayCaster();
  var intersects = raycaster.intersectObjects( scene.children );

  if(currSelected){
    currSelected.material.color.setHex(lastColor);
    currSelected = null;
  }

  if(intersects.length > 0) {
    controls.enabled = false;
    currSelected = intersects[0].object;
    lastColor = intersects[0].object.material.color.getHex();
    currSelected.material.color.setHex(0xffffff);
  } else {
    //add new point
  }
}

function getRayCaster() {
  // normalized device coordinates
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 ).unproject( camera );
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

  return raycaster;
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