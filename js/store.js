import { createStore } from 'redux'
import update from 'react-addons-update';
import {completeFloorplan} from './floorplan';

const initalState = {
  points: [
    {x: 0, y: 0, id: 0},
    {x: 0, y: 400, id: 1},
    {x: 500, y: 0, id: 2},
    {x: 500, y: 200, id: 3}
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

    default:
      nextState = state;
      break;
  }

  return nextState; //completeFloorplan(nextState);
});


function addPoint ({lines, points}, {pos, pointId}) {
  var newId = points.length;
  return {
    points: update(points, {$push: {x: pos.x, y: pos.y, id: pointId}}),
    lines: update(lines, {$push: {from: pointId, to: newId}})
  };
}

export const ACTIONS = {
  addPoint (pointId, pos) {
    return {
      type: 'ADD_POINT',
      pos: pos,
      pointId: pointId
    }
  }
};

export default store;