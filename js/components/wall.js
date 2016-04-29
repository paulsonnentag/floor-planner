import React from 'react';
import THREE from 'three';

const Wall = ({from, to, color}) => {

  let vertices = [
    new THREE.Vector3(from.x || 0, from.y || 0, from.z ||0),
    new THREE.Vector3(to.x || 0, to.y || 0, to.z || 0)
  ];

  let width;
  let depth;

  let offsetX;
  let offsetZ;

  let widthDif = Math.abs(from.x - to.x);
  let depthDif = Math.abs(from.z - to.z);

  if(widthDif > depthDif) {
    depth = 1.5;
    width = widthDif;

    

  } else {
    width = 1.5;
    depth = depthDif;
  }


  return (
    <mesh
          position={new THREE.Vector3(from.x + widthDif / 2, from.y, from.z + depthDif / 2)}
          castShadow={true}>
      <boxGeometry
        width={width}
        height={50}
        depth={depth}/>
      <meshPhongMaterial
        color={color}/>
    </mesh>
  );
};

export default Wall;