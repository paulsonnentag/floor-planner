import React from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import { Provider } from 'react-redux';

import store from '../store';
import FloorPlan from './floorplan';


export default class App extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.cameraPosition = new THREE.Vector3(500, 500, 500);
  }

  componentDidMount () {
    var controls = new (OrbitControls(THREE))(this._camera);
  }

  render () {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <React3
        mainCamera="camera"
        width={width}
        height={height}>
      <scene>
        <perspectiveCamera
          ref={(camera) => {this._camera = camera}}
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.cameraPosition}/>
        <Provider store={store}>
          <FloorPlan getCamera={() => this._camera}/>
        </Provider>
      </scene>
    </React3>);
  }
}
