import React from 'react';
import {connect} from 'react-redux';
import THREE from 'three';
import _ from 'lodash';
import {ACTIONS} from '../store';

@connect(
  getProps,
  getDispatch
)
export default class FloorPlan extends React.Component {

  constructor (props, context) {
    super(props, context);

    this.state = {
      selectedPointId: null
    }
  }

  componentDidMount () {
    document.addEventListener('click', (evt) => this.selectPoint(evt.clientX, evt.clientY));
  }

  selectPoint (x, y) {
    let raycaster = getRaycaster(this.props.getCamera(), x, y);
    let intersects = raycaster.intersectObjects(this._group.children);

    this.setState({
      selectedPointId: intersects.length > 0 ? getPointId(intersects[0].object.name) : null
    });
  }

  render () {
    const {points, lines, camera} = this.props;
    const {selectedPointId} = this.state;

    const corners = _.map(points, ({x, y}, id) => (
      <mesh key={id}
            position={new THREE.Vector3(x, 0, y)}
            name={`point_${id}`}>
        <boxGeometry
          width={20}
          height={20}
          depth={20}/>
        <meshBasicMaterial
          color={selectedPointId === id ? 0xff0000 :0x00ff00}/>
      </mesh>
    ));

    return (
      <group ref={(group) => this._group = group}>
        {corners}
      </group>
    )
  }
}

function getPointId (name) {
  let match = name.match(/^point_(.*)$/);
  return match && parseInt(match[1], 10);
}


function getRaycaster(camera, x, y) {
  // normalized device coordinates
  var normX = (x / window.innerWidth) * 2 - 1;
  var normY = - (y / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  var vector = new THREE.Vector3( normX, normY , 1).unproject( camera );
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

  return raycaster;
}

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
     addPoint (x, y) {
      dispatch(ACTIONS.addSinglePoint(x, y));
    }
  }
}
