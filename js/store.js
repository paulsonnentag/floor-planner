import { createStore } from 'redux'
import update from 'react-addons-update';
import {completeFloorplan} from './floorplan';

const initalState = {
  points: [
    {x: 0, z: 0, id: 0},
    {x: 0, z: 40, id: 1},
    {x: 50, z: 0, id: 2},
    {x: 50, z: 20, id: 3}
  ],

  lines: [
    {from: 0, to: 1},
    {from: 0, to: 2},
    {from: 2, to: 3}
  ]
};

const store = createStore((state = initalState, action) => {
  let nextState;

  switch (action.type) {
    case 'ADD_POINT':
      nextState = addPoint(state, action);
      break;

    case 'CONNECT_POINTS':
      nextState = connectPoints(state, action);
      break;

    default:
      nextState = state;
      break;
  }

  return nextState; //completeFloorplan(nextState);
});


function addPoint ({lines, points}, {pos, pointId}) {
  var newId = points.length;
  return {
    points: update(points, {$push: [{x: pos.x, z: pos.z, id: pointId}]}),
    lines: update(lines, {$push: [{from: pointId, to: newId}]})
  };
}

function connectPoints (state, {point1Id, point2Id}) {
  return update(state, {
    lines: {$push: [{from: point1Id, to: point2Id}]}
  })
}

export const ACTIONS = {
  addPoint (pointId, pos) {
    return { type: 'ADD_POINT', pos, pointId: pointId}
  },

  connectPoints (point1Id, point2Id) {
    return { type: 'CONNECT_POINTS', point1Id, point2Id};
  }
};

export default store;