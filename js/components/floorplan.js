import React from 'react';
import {connect} from 'react-redux';
import THREE from 'three';
import _ from 'lodash';

import {ACTIONS} from '../store';
import Line from './line';
import Wall from './Wall'

@connect(
  getProps,
  getDispatch
)
export default class FloorPlan extends React.Component {

  constructor (props, context) {
    super(props, context);

    this.state = {
      selectedPointId: null,
      mousePosition: new THREE.Vector3(0, 0, 0)
    };
  }

  componentDidMount () {
    document.addEventListener('click', (evt) => this.handleClick(evt.clientX, evt.clientY));
    document.addEventListener('mousemove', (evt) => this.updateMousePosition(evt.clientX, evt.clientY))
  }

  handleClick (x, y) {
    const {mousePosition, selectedPointId} = this.state;

    if (selectedPointId === null) {
      this.selectPoint(x, y);

    } else {
      this.addPoint();
    }
  }

  updateMousePosition (x, y) {
    let raycaster = getRaycaster(this.props.getCamera(), x, y);
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

  addPoint () {
    const {points} = this.props;
    const {mousePosition, selectedPointId} = this.state;
    const selectedPoint = points[selectedPointId];
    const restricted = snapToAxis(selectedPoint, mousePosition);

    this.props.addPoint(selectedPointId, {
      x: selectedPoint.x + restricted.x,
      z: selectedPoint.z + restricted.z
    });
    this.setState({selectedPointId: null});
  }

  render () {
    const {points, lines, camera} = this.props;
    const {selectedPointId, mousePosition} = this.state;
    const selectedPoint = points[selectedPointId];

    let selectionLine;

    const corners = _.map(points, ({x, z}, id) => (
      <mesh key={id}
            position={new THREE.Vector3(x, 0, z)}
            name={`point_${id}`}
            castShadow={true}>
        <boxGeometry
          width={1}
          height={1}
          depth={1}/>
        <meshPhongMaterial
          color={selectedPointId === id ? 0xFFC04C :0x26457F}/>
      </mesh>
    ));

    const walls = _.map(lines, ({from, to}, i) => (
      
      <Wall
        key={i}
        from={from}
        to={to}
        color={0xffffff}/>
      
      /*<Line
        key={i}
        from={from}
        to={to}
        color={0x4C8BFF}/>*/
    ));

    if (selectedPoint && mousePosition) {
      let restricted = snapToAxis(selectedPoint, mousePosition);


      selectionLine = (
        <Line
          from={{x: selectedPoint.x, z: selectedPoint.z}}
          to={{x: selectedPoint.x + restricted.x,  z: selectedPoint.z + restricted.z}}
          color={0xFFD281}/>
      )
    }

    return (
      <group>
        {selectionLine}
        <group ref={(group) => this._pointGroup = group}>
          {corners}
        </group>
        <group>
          {walls}
        </group>
      </group>
    );
  }
}

function getPointId (name) {
  let match = name.match(/^point_(.*)$/);
  return match && parseInt(match[1], 10);
}

function snapToAxis (refVec, vec) {
  const diffX = vec.x - refVec.x;
  const diffZ = vec.z - refVec.z;

  return (Math.abs(diffX) > Math.abs(diffZ)) ?
  {x: diffX, y: 0, z: 0}
    :
  {x: 0, y: 0, z: diffZ};
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
    addPoint (pointId, pos) {
      dispatch(ACTIONS.addPoint(pointId, pos));
    }
  }
}
