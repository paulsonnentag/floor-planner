'use strict';

import _ from 'lodash';
import THREE from 'three';

// sample data


export function createModel (floorplan) {
  var material = new THREE.LineBasicMaterial({
    color: 0xff0000
  });

  var geometry = new THREE.Geometry();
  geometry.vertices = getVertices(floorplan);

  var lines = new THREE.Line(geometry, material);

  var points = getPointModel(floorplan.points);
  
  return {lines, points};
}

function getVertices ({lines, points}) {
  return _(lines)
    .map(({from, to}) => [
      points[from],
      points[to]
    ])
    .flatten()
    .map(({x, y}) => new THREE.Vector3(x, y, 0))
    .value();
}

function getPointModel(points) {
  return _.map(points, ({x, y}, id) => {
    var geometry = new THREE.BoxGeometry(20, 20, 20);
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.data = {id};

    return mesh;
  });
}


function getLines () {

}

function completeFloorplan (floorplan) {

}