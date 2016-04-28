'use strict';

import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import {createModel} from './floorplan';



var scene, camera, renderer, controls;
var currSelected, newPoint, mouseActive;
var lastX, lastY, lastColor;
var mouse = {x:0, y:0};


// add floorplan
var floorGrp;
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
  camera.position.z = 500;
  camera.position.y = 500;
  camera.position.x = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x555555, 1.0);


  controls = new (OrbitControls(THREE))(camera);

  var floorplanModel = createModel(floorplan);
  floorGrp = new THREE.Group();

  _.each(floorplanModel.points, (box) => floorGrp.add(box));
  _.each(floorplanModel.lines, (line) => floorGrp.add(line));

  scene.add(floorGrp);

  //static meshes
  var ground = new THREE.PlaneGeometry(1000, 1000, 1);
  var groundMat = new THREE.MeshBasicMaterial({color : 0xAAAAAA});
  var groundMesh = new THREE.Mesh(ground, groundMat);

  groundMesh.rotateX(Math.PI / -2);

  scene.add(groundMesh);

  var grid = new THREE.GridHelper(1000, 100);
  scene.add(grid);



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

  if(currSelected && vec && mouseActive && newPoint) {

    if(Math.abs(newPoint.position.x - vec.x) < Math.abs(newPoint.position.y - vec.y)) {
      vec.x = newPoint.position.x;
    } else {
      vec.y = newPoint.position.y;
    }

    currSelected.position.copy(vec);

  } else if(currSelected && vec && mouseActive) {

    if(Math.abs(lastX - vec.x) < Math.abs(lastY - vec.y)) {
      vec.x = lastX;
    } else {
      vec.y = lastY;
    }

    currSelected.position.copy(vec);
  }

}

function deactivateDD() {

  if(currSelected && newPoint && !isPointInFloorMap()) {
    scene.remove(currSelected);
    currSelected = null;
  }

  newPoint = null;
  controls.enabled = true;
  mouseActive = false;
}

function handleClick() {
  mouseActive = true;
  var raycaster = getRayCaster();
  var intersects = raycaster.intersectObjects( floorGrp.children );

  if(currSelected){
    currSelected.material.color.setHex(lastColor);
  }

  if(intersects.length > 0 && currSelected !== intersects[0].object) {
    controls.enabled = false;
    currSelected = intersects[0].object;
    lastX = currSelected.position.x;
    lastY = currSelected.position.y;
    lastColor = intersects[0].object.material.color.getHex();
    currSelected.material.color.setHex(0xffffff);

  } else if(currSelected  && (intersects.length === 0 || currSelected !== intersects[0].object)) {
    var vec = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)));

    var geometry = new THREE.BoxGeometry(20, 20, 20);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var mesh = new THREE.Mesh(geometry, material);

    if(Math.abs(currSelected.position.x - vec.x) < Math.abs(currSelected.position.y - vec.y)) {
      vec.x = currSelected.position.x;
    } else {
      vec.y = currSelected.position.y;
    }

    //adding new mesh
    mesh.position.x = vec.x;
    mesh.position.y = vec.y;
    mesh.position.z = 0;

    scene.add(mesh);
    //

    controls.enabled = false;
    lastColor = mesh.material.color.getHex();
    newPoint = currSelected;
    currSelected = mesh;
    lastX = currSelected.position.x;
    lastY = currSelected.position.y;
    currSelected.material.color.setHex(0xffffff);

  } else {
    currSelected = null;
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

function isPointInFloorMap() {
  var inFloorMap = true;

  return inFloorMap;
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