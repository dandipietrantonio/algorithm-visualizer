// function coinFlip() {
//     return Math.floor(Math.random() * 2);
// }

// function generateRandomPolyLineArray() {
//     const NUM_VERTICES = 10;
//     var ret = [[5,5]];

//     for (var i=1; i < NUM_VERTICES; i++) {
//         const x = Math.floor(Math.random() * 90 * i) + 10
//         const y = Math.floor(Math.random() * 90 * i) + 10
//         var negatingLeftOrRight = "neither";
//         ret.push([x,y])
//     }
//     return ret

// }

var EPSILON;

var curDelay = 0;
const timeUnit = 250;

var pointsArr = [];
var pointCircles = [];
var blackLines = [];

var distancePoints = [];
var distancePointCircles = [];
var distanceLine = [];

var distanceContainer = d3
  .select('#RDP')
  .append('svg')
  .attr('style', 'outline: thin solid blue; margin-bottom: 10px')
  .attr('width', '100%')
  .attr('height', '20%');

// This click handler is based on the handler from http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
distanceContainer.on('click', (event) => {
  var coords = d3.pointer(event);

  // Normally we go from data to pixels, but here we're doing pixels to data
  var clickCoords = [
    Math.round(coords[0]), // Takes the pixel number to convert to number
    Math.round(coords[1]),
  ];

  if (distancePoints.length !== 2) {
    distancePoints.push([clickCoords[0], clickCoords[1]]);

    distancePointCircles.push({
      x_axis: clickCoords[0],
      y_axis: clickCoords[1],
      radius: 6,
      color: 'green',
    });

    if (distancePoints.length > 1) {
      const endIndex = distancePointCircles.length - 1;
      distanceLine.push({
        id:
          'a' +
          distancePoints[endIndex - 1].toString().replace(',', '') +
          distancePoints[endIndex].toString().replace(',', ''),
        x1: distancePoints[endIndex - 1][0],
        y1: distancePoints[endIndex - 1][1],
        x2: distancePoints[endIndex][0],
        y2: distancePoints[endIndex][1],
      });
    }

    var distanceCircles = distanceContainer
      .selectAll('circle') // For new circle, go through the update process
      .data(distancePointCircles)
      .enter()
      .append('circle');

    var circleAttributes = distanceCircles
      .attr('cx', (d) => d.x_axis)
      .attr('cy', (d) => d.y_axis)
      .attr('r', (d) => d.radius)
      .style('fill', (d) => d.color);

    var lines = distanceContainer.selectAll('line').data(distanceLine).enter().append('line');

    var lineAttributes = lines
      .attr('stroke-width', 2)
      .attr('stroke', 'green')
      .attr('id', (d) => d.id)
      .attr('x1', (d) => d.x1)
      .attr('y1', (d) => d.y1)
      .attr('x2', (d) => d.x2)
      .attr('y2', (d) => d.y2);
    if (distancePoints.length === 2) {
      a = Math.abs(distancePoints[0][0] - distancePoints[1][0]);
      b = Math.abs(distancePoints[0][1] - distancePoints[1][1]);
      EPSILON = Math.sqrt(a ** 2 + b ** 2);
      console.log('EPSILON: ', EPSILON);
    }
  }
});

var svgContainer = d3
  .select('#RDP')
  .append('svg')
  .attr('style', 'outline: thin solid red')
  .attr('width', '100%')
  .attr('height', '80%');

// This click handler is based on the handler from http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
svgContainer.on('click', (event) => {
  var coords = d3.pointer(event);

  // Normally we go from data to pixels, but here we're doing pixels to data
  var clickCoords = [
    Math.round(coords[0]), // Takes the pixel number to convert to number
    Math.round(coords[1]),
  ];

  pointsArr.push([clickCoords[0], clickCoords[1]]);

  pointCircles.push({
    x_axis: clickCoords[0],
    y_axis: clickCoords[1],
    radius: 6,
    color: 'black',
  });

  if (pointsArr.length > 1) {
    const endIndex = pointCircles.length - 1;
    blackLines.push({
      id:
        'a' +
        pointsArr[endIndex - 1].toString().replace(',', '') +
        pointsArr[endIndex].toString().replace(',', ''),
      x1: pointsArr[endIndex - 1][0],
      y1: pointsArr[endIndex - 1][1],
      x2: pointsArr[endIndex][0],
      y2: pointsArr[endIndex][1],
    });
  }
  console.log('BLACK LINES: ', blackLines);

  var circles = svgContainer
    .selectAll('circle') // For new circle, go through the update process
    .data(pointCircles)
    .enter()
    .append('circle');

  var circleAttributes = circles
    .attr('cx', (d) => d.x_axis)
    .attr('cy', (d) => d.y_axis)
    .attr('r', (d) => d.radius)
    .style('fill', (d) => d.color);

  var lines = svgContainer.selectAll('line').data(blackLines).enter().append('line');

  var lineAttributes = lines
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
    .attr('id', (d) => d.id)
    .attr('x1', (d) => d.x1)
    .attr('y1', (d) => d.y1)
    .attr('x2', (d) => d.x2)
    .attr('y2', (d) => d.y2);
});

function RDP(points, epsilon) {
  // points should be an (ordered) array of (x,y) coordinates\
  console.log('in rdp');
  if (points.length <= 2) return;
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const id = 'a' + startPoint.toString().replace(',', '') + endPoint.toString().replace(',', '');
  console.log(startPoint, endPoint);
  svgContainer
    .append('line')
    .attr('stroke-width', 2)
    .attr('stroke', 'red')
    .attr('id', id)
    .attr('x1', startPoint[0])
    .attr('y1', startPoint[1])
    .attr('x2', startPoint[0])
    .attr('y2', startPoint[1]);
  svgContainer
    .select('#' + id)
    .transition()
    .duration(timeUnit)
    .delay(function (d) {
      return curDelay++ * timeUnit;
    })
    .attr('x2', endPoint[0])
    .attr('y2', endPoint[1]);
  const temp = findFurthestPoint(points);
  console.log('TEMP: ', temp);
  if (temp) {
    const furthestPoint = temp[0];
    const furthestPointIndex = temp[1];
    const furthestPointDistance = temp[2];
    if (furthestPointDistance > epsilon) {
      svgContainer
        .select('#' + id)
        .transition()
        .delay(function (d) {
          return curDelay++ * timeUnit;
        })
        .remove();
      RDP(points.slice(0, furthestPointIndex + 1), epsilon);
      RDP(points.slice(furthestPointIndex, points.length), epsilon);
    }
    return;
  }
}

function findFurthestPoint(points) {
  // based on code from Stack Overflow: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
  // we have 3 cases:
  //    1. the point is closest to the start point
  //    2. the point is closest to the end point
  //    3. the point is closest to another point on the line (this is its perpindicular distance)
  // this implementation accounts for all three cases

  console.log('finding furthest point. delay is ', curDelay);

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  const xStart = startPoint[0];
  const yStart = startPoint[1];
  const xEnd = endPoint[0];
  const yEnd = endPoint[1];

  var curMaxPoint = null;
  var curMaxDistance = 0;
  var curMaxIndex;

  for (var i = 1; i < points.length - 1; i++) {
    const curPoint = points[i];
    const xCurPoint = curPoint[0];
    const yCurPoint = curPoint[1];

    const id = xCurPoint.toString() + yCurPoint.toString() + curDelay.toString();

    svgContainer
      .append('line')
      .attr('id', 'drawingLine' + id) // guaranteed to be unique
      .attr('class', 'drawingLine')
      .attr('stroke-width', 2)
      .attr('stroke', 'orange')
      // .attr('id', 'a' + startPoint.toString().replace(',', '') + endPoint.toString().replace(',', ''))
      .attr('x1', xCurPoint)
      .attr('y1', yCurPoint)
      .attr('x2', xCurPoint)
      .attr('y2', yCurPoint);

    console.log('i: ', i);
    console.log('curDelay Variable: ', curDelay);
    d3.select('#drawingLine' + id)
      .transition()
      .duration(timeUnit)
      .delay(function (d) {
        console.log('DELAY: ', (curDelay + i) * timeUnit);
        return (curDelay + i) * timeUnit;
      })
      .attr('x2', 0)
      .attr('y2', 0)
      .on('end', () => {
        console.log('deleting point ' + id);
        svgContainer.select('#drawingLine' + id).remove();
      });

    var A = xCurPoint - xStart;
    var B = yCurPoint - yStart;
    var C = xEnd - xStart;
    var D = yEnd - yStart;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0)
      //in case of 0 length line
      param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
      xx = xStart;
      yy = yStart;
    } else if (param > 1) {
      xx = xEnd;
      yy = yEnd;
    } else {
      xx = xStart + param * C;
      yy = yStart + param * D;
    }

    var dx = xCurPoint - xx;
    var dy = yCurPoint - yy;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > curMaxDistance) {
      curMaxDistance = distance;
      curMaxPoint = curPoint;
      curMaxIndex = i;
    }
  }
  curDelay += i;
  if (curMaxPoint) {
    console.log('MAX DISTANCE: ', curMaxDistance);
    return [curMaxPoint, curMaxIndex, curMaxDistance];
  } else return null;
}

d3.select('body').on('keydown', (e) => {
  if (e.code === 'Space') {
    console.log('pressed space');
  }
});

function start() {
  svgContainer.selectAll('line').attr('stroke-dasharray', '10,10');
  RDP(pointsArr, EPSILON);
}

function reset() {
  pointsArr = [];
  pointCircles = [];
  blackLines = [];

  distancePoints = [];
  distancePointCircles = [];
  distanceLine = [];

  curDelay = 0;

  svgContainer.selectAll('*').remove();
  distanceContainer.selectAll('*').remove();
}

// CASES
// 1. No distance point plotted
// 2. One distance point plotted
// 3. Distance points plotted; plotting line segment
// 4. 'Run RDP' initially hit
// 5. Illustrating first polyline (ie: from start to end)
// 6. Calculating (and showing) distance of a point with another point after
//    - in this state, we have to keep track of what point we're currently on in a global variable
// 7. Calculating (and showing) distance of a point without another point after
// 8. Showing furthest point from the proposed simplified line
//    - if it's closer than epsilon, we finish
//    - otherwise, we set it as a new endpoint and recursively operate on the left and right
