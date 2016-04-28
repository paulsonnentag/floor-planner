import React from 'react';
import {connect} from 'react-redux';
import THREE from 'three';
import _ from 'lodash';

const FloorPlan = connect(
  getProps,
  getDispatch
)
(({points, lines}) => {
  const corners = _.map(points, ({x, y}, i) => (
    <mesh key={i}
      position={new THREE.Vector3(x, y, 0)}>
      <boxGeometry
        width={10}
        height={10}
        depth={10}/>
      <meshBasicMaterial
        color={0x00ff00}/>
    </mesh>
  ));

  return (
    <group>
      {corners}
    </group>
  );
});


function getProps ({points, lines}) {
  return {
    points: points,
    lines: _.map(lines, ({from, to}) => ({
      from: points[from],
      to: points[to]
    }))
  };
}

function getDispatch (dispatch) {
  return {
    clickHandler (evt) {



    }
  }
}

export default FloorPlan