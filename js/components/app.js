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

    this.cameraPosition = new THREE.Vector3(50, 50, 50);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  updateSize () {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  componentDidMount () {
    var controls = new (OrbitControls(THREE))(this._camera);

    window.addEventListener('resize', () => this.updateSize());
  }

  render () {
    const {width, height} = this.state;

    return (
      <React3
        mainCamera="camera"
        width={width}
        height={height}
        clearColor={0xaaaaaa}
        shadowMapEnabled={true}
        shadowMapType={THREE.PCFSoftShadowMap}>
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
        <spotLight
          position = {new THREE.Vector3(50, 50, 50)}
          angle={90}
          intensity={0.3}
          castShadow={true}
          shadowMapWidth={2048}
          shadowMapHeight={2048}
          shadowCameraFar={200}
          />
        <ambientLight
          color={0xcccccc}/>
        <mesh
              position={new THREE.Vector3(0, -0.5, 0)}
              scale={new THREE.Vector3(20, 20, 20)}
              rotation={new THREE.Euler(Math.PI / -2)}
              receiveShadow={true}>
          <planeGeometry
            height={10}
            width={10}/>
          <meshPhongMaterial
            specular={0}
            shininess={0}
            color={0xaaaaaa}/>
        </mesh>
      </scene>
    </React3>);
  }
}
