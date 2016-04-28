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
      selectedPointId: 0,
      mousePosition: new THREE.Vector3(0, 0, 0)
    };
  }

  componentDidMount () {
    document.addEventListener('click', (evt) => this.selectPoint(evt.clientX, evt.clientY));
    document.addEventListener('mousemove', (evt) => this.updateMousePosition(evt.clientX, evt.clientY))
  }

  updateMousePosition (x, y) {
    let raycaster = getRaycaster(this.props.getCamera(), x, y)
    var mousePosition = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0)));

    this.setState({mousePosition});
  }

  selectPoint (x, y) {
    let raycaster = getRaycaster(this.props.getCamera(), x, y);
    let intersects = raycaster.intersectObjects(this._pointGroup.children);

    this.setState({
      selectedPointId: intersects.length > 0 ? getPointId(intersects[0].object.name) : null
    });
  }

  render () {
    const {points, lines, camera} = this.props;
    const {selectedPointId, mousePosition} = this.state;
    const selectedPoint = points[selectedPointId];

    let selectionLine;

    const corners = _.map(points, ({x, z}, id) => (
      <mesh key={id}
            position={new THREE.Vector3(x, 0, z)}
            name={`point_${id}`}>
        <boxGeometry
          width={20}
          height={20}
          depth={20}/>
        <meshBasicMaterial
          color={selectedPointId === id ? 0xff0000 :0x00ff00}/>
      </mesh>
    ));

    if (selectedPoint) {
      let vertices = [
        new THREE.Vector3(selectedPoint.x,  0, selectedPoint.z),
        new THREE.Vector3(mousePosition.x,  0, mousePosition.z)
      ];

      selectionLine = (
        <line>
          <geometry
            vertices={vertices}>
          </geometry>
          <lineBasicMaterial
            color={0x00ff00}/>
        </line>
      );
    }

    return (
      <group>
        {selectionLine}
        <group ref={(group) => this._pointGroup = group}>
          {corners}
        </group>
      </group>
    );

  }

}

function getPointId (name) {
  let match = name.match(/^point_(.*)$/);
  return match && parseInt(match[1], 10);
}


function getRaycaster (camera, x, y) {
  // normalized device coordinates
  var normX = (x / window.innerWidth) * 2 - 1;
  var normY = -(y / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  var vector = new THREE.Vector3(normX, normY, 1).unproject(camera);
  raycaster.set(camera.position, vector.sub(camera.position).normalize());

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
