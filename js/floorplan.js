'use strict';

import _ from 'lodash';

export function completeFloorplan (floorplan) {
  var endPoint;
  var {points, lines} = floorplan;
  var pointsWithLines = _.map(points, (point) => _.assign({}, point, {lines: getConnectedLines(lines, point.id)}));
  var endPoints = _.filter(pointsWithLines, (point) => point.lines.length === 1);

  while (endPoint = endPoints.pop()) {
    let nearestPoint = getNearestPoint(endPoint, endPoints);

    let {from, to} = endPoint.lines[0];
    let fromPoint = points[from];
    let toPoint = points[to];
    let pointId = points.length;

    let newPoint = (Math.abs(fromPoint.x - toPoint.x) > Math.abs(fromPoint.y - toPoint.y)) ?
    { id: pointId,
      x: nearestPoint.x,
      y: endPoint.y }
      :
    { id: pointId,
      x: endPoint.x,
      y: nearestPoint.y };

    floorplan.lines.push({from: nearestPoint.id, to: pointId});
    floorplan.lines.push({from: endPoint.id, to: pointId});
    floorplan.points.push(newPoint);

    endPoints = _.reject(endPoints, ({id}) => id == nearestPoint.id);
  }

  return floorplan;
}

function getConnectedLines (lines, id) {
  return _.filter(lines, ({from, to}) => (from === id || to === id));
}

function getNearestPoint (point, points) {
  return _.reduce(points,
    ({min, nearestPoint}, comparePoint) => {
      var distance = Math.pow(point.x - comparePoint.x, 2) + Math.pow(point.y - comparePoint.y, 2);
      return distance < min ? {min: distance, nearestPoint: comparePoint} : {min, nearestPoint}
    },
    {
      min: Infinity,
      nearestPoint: null
    }
  ).nearestPoint;
}