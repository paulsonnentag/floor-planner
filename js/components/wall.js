import React from 'react';
import THREE from 'three';

const Wall = ({from, to, color}) => {

  let vertices = [
    new THREE.Vector3(from.x || 0, from.y || 0, from.z ||0),
    new THREE.Vector3(to.x || 0, to.y || 0, to.z || 0)
  ];

  let width;
  let depth;
  let height = 25;

  let offsetX;
  let offsetZ;

  let widthDif = Math.abs(from.x - to.x);
  let depthDif = Math.abs(from.z - to.z);

  if(widthDif > depthDif) {
    depth = 1.5;
    width = widthDif;

    offsetZ = to.z;

    if(from.x > to.x) {
      offsetX = from.x - widthDif / 2;
    } else {
      offsetX = from.x + widthDif / 2;
    }

  } else {
    width = 1.5;
    depth = depthDif;

    offsetX = to.x;

    if(from.z > to.z) {
      offsetZ = from.z - depthDif / 2;
    } else {
      offsetZ = from.z + depthDif / 2;
    }

  }


  return (
    <mesh
          position={new THREE.Vector3(offsetX, height / 2 - 0.5, offsetZ)}
          castShadow={true}
          receiveShadow={true}>
      <boxGeometry
        width={width}
        height={height}
        depth={depth}/>
      <meshPhongMaterial
        color={color}/>
    </mesh>
  );
};

export default Wall;