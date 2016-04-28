import React from 'react';
import THREE from 'three';

const Line = ({from, to, color}) => {

  let vertices = [
    new THREE.Vector3(from.x || 0, from.y || 0, from.z ||0),
    new THREE.Vector3(to.x || 0, to.y || 0, to.z || 0)
  ];

  return (
    <line>
      <geometry
        vertices={vertices}>
      </geometry>
      <lineBasicMaterial
        color={color}/>
    </line>
  );
};

export default Line;