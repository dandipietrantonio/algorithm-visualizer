var pointsArr1 = [];
var pointCircles1 = [];
var lines1 = [];

var pointsArr2 = [];
var pointCircles2 = [];
var lines2 = [];

function getCurSelectedLine() {
  const lineRadio = document.getElementsByName('lineRadio');

  if (lineRadio[0].checked) return 1;
  else return 0;
}

const POINT_RADIUS = 4;
const MAX_POINTS_NUM = 15;

var polylineSVG = d3
  .select('#pointContainer')
  .append('svg')
  .attr('style', 'outline: thin solid black')
  .attr('width', '100%')
  .attr('height', '100%');

// This click handler is based on the handler from http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
polylineSVG.on('click', (event) => {
  var coords = d3.pointer(event);

  // Normally we go from data to pixels, but here we're doing pixels to data
  var clickCoords = [
    Math.round(coords[0]), // Takes the pixel number to convert to number
    Math.round(coords[1]),
  ];

  if (getCurSelectedLine() == 1) {
    const ret = processPointClickForPolyline(clickCoords, pointsArr1, pointCircles1, lines1);
    console.log('RET: ', ret);
    pointsArr1 = ret[0];
    pointCircles1 = ret[1];
    lines1 = ret[2];
  } else {
    const ret = processPointClickForPolyline(clickCoords, pointsArr2, pointCircles2, lines2);
    pointsArr2 = ret[0];
    pointCircles2 = ret[1];
    lines2 = ret[2];
  }
});

function processPointClickForPolyline(
  coordinatesClicked,
  inputPointsArr,
  inputPointCirclesArr,
  inputLinesArr,
) {
  const curClass = getCurSelectedLine() == 1 ? 'line1' : 'line2';

  if (inputPointsArr.length > MAX_POINTS_NUM) {
    d3.select('body')
      .select(`#${curClass}List`)
      .append('p')
      .text(`Maximum ${MAX_POINTS_NUM} were already added to Line ${getCurSelectedLine()}`);
    window.alert(`Maximum ${MAX_POINTS_NUM} were already added to Line ${getCurSelectedLine()}`);

    return;
  }

  var newPointsArr = inputPointsArr;
  var newPointCircles = inputPointCirclesArr;
  var newLines = inputLinesArr;

  const xCoord = coordinatesClicked[0];
  const yCoord = coordinatesClicked[1];

  var duplicateClick = false;
  newPointsArr.forEach((point) => {
    if (point[0] === xCoord && point[1] === yCoord) {
      duplicateClick = true;
    }
  });

  if (!duplicateClick) {
    newPointsArr.push([xCoord, yCoord]);

    newPointCircles.push({
      x_axis: xCoord,
      y_axis: yCoord,
      radius: POINT_RADIUS,
      color: getCurSelectedLine() == 1 ? 'blue' : 'red',
    });

    if (newPointsArr.length > 1) {
      const endIndex = newPointCircles.length - 1;
      newLines.push({
        id:
          'a' +
          newPointsArr[endIndex - 1].toString().replace(',', '') +
          newPointsArr[endIndex].toString().replace(',', ''),
        x1: newPointsArr[endIndex - 1][0],
        y1: newPointsArr[endIndex - 1][1],
        x2: newPointsArr[endIndex][0],
        y2: newPointsArr[endIndex][1],
      });
    }
    var circles = polylineSVG
      .selectAll(`circle ${curClass}`) // For new circle, go through the update process
      .data(newPointCircles)
      .enter()
      .append('circle');

    var circleAttributes = circles
      .attr('cx', (d) => d.x_axis)
      .attr('cy', (d) => d.y_axis)
      .attr('r', (d) => d.radius)
      .attr('class', `circle ${curClass}`)
      .style('fill', (d) => d.color);

    var inputLinesArr = polylineSVG
      .selectAll(`line ${curClass}`)
      .data(newLines)
      .enter()
      .append('line');

    var lineAttributes = inputLinesArr
      .attr('stroke-width', 1)
      .attr('stroke', getCurSelectedLine() == 1 ? 'blue' : 'red')
      .attr('id', (d) => d.id)
      .attr('x1', (d) => d.x1)
      .attr('y1', (d) => d.y1)
      .attr('x2', (d) => d.x2)
      .attr('class', `line ${curClass}`)
      .attr('y2', (d) => d.y2);

    const textStrToAppend = `(${xCoord}, ${yCoord}), `;

    d3.select('body').select(`#${curClass}List`).append('span').text(textStrToAppend);

    console.log('new points arr: ', newPointsArr);
    console.log('new points circles: ', newPointCircles);
    return [newPointsArr, newPointCircles, newLines];
  }
  return;
}
