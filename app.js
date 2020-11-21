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

EPSILON = 0.1


const pointsArr = [
    [100, 150],
    [200,350],
    [300,400],
    [315,210],
    [235,100],
    [440,95],
    [410,285],
    [360, 400],
    [400, 400],
    [580, 260],
    [625, 200]
]

var jsonCircles = pointsArr.map(point => {
    return {
        "x_axis": point[0],
        "y_axis": point[1],
        "radius": 3,
        "color": "black",
    }
}) 

var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", 2000)
    .attr("height", 2000);

for (var i=0; i < jsonCircles.length-1; i++) {
    svgContainer.append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("x1",  jsonCircles[i].x_axis)
        .attr("y1",  jsonCircles[i].y_axis)
        .attr("x2",  jsonCircles[i+1].x_axis)
        .attr("y2",  jsonCircles[i+1].y_axis);
}

var circles = svgContainer
    .selectAll("circle")
    .data(jsonCircles)
    .enter()
    .append("circle");
   
var circleAttributes = circles
    .attr("cx", d => d.x_axis)
    .attr("cy", d => d.y_axis)
    .attr("r", d => d.radius)
    .style("fill", d => d.color);

var i = 0;
function RDP(points, epsilon) {
    // points should be an (ordered) array of (x,y) coordinates
    if (points.length <2) return;
    const startPoint = points[0];
    const endPoint = points[ points.length -1 ]
    console.log(startPoint, endPoint)
    svgContainer.append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "red")
        .attr("id", "a"+startPoint.toString().replace(',', '') + endPoint.toString().replace(',', ''))
        .attr("x1", startPoint[0])
        .attr("y1", startPoint[1])
        .attr("x2", endPoint[0])
        .attr("y2", endPoint[1]);
    const temp = findFurthestPoint(points);
    if (temp) {
        console.log("FURTHEST POINT: ", temp[0])
        const furthestPoint = temp[0];
        const furthestPointIndex = temp[1];
        const furthestPointDistance = temp[2];
        if (furthestPointDistance > epsilon) {
            svgContainer
                .select("#a"+startPoint.toString().replace(',', '') + endPoint.toString()
                .replace(',', ''))
                .remove();
            console.log(points.slice(0, furthestPointIndex+1))
            arr2 = console.log(points.slice(furthestPointIndex, points.length))
            RDP(points.slice(0, furthestPointIndex+1), epsilon)
            RDP(points.slice(furthestPointIndex, points.length), epsilon)
        }
        return
    }
}

// RDP(pointsArr);

function findFurthestPoint(points) {
    // points should be an (ordered) array of (x,y) coordinates
    // returns furthest point from the line connecting the first and last point
    // based on distance formula found in http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.17.6932

    // return [[300,400], 3];
    const startPoint = points[0];
    const endPoint = points[ points.length -1 ]
    var curPoint = null;
    var curMaxPoint = null;
    var curMaxDistance = 0
    var curMaxIndex;
    for (var i=1; i<points.length -1; i++) {
        curPoint = points[i];
        const numerator = math.det([
            [1, startPoint[0], startPoint[1]],
            [1, endPoint[0], endPoint[1]],
            [1, curPoint[0], curPoint[1]],
        ]);
        // console.log("DET:", numerator)
        const denominator = Math.pow((startPoint[0] - endPoint[0]), 2) + Math.pow((startPoint[1] - endPoint[1]), 2);
        const distance = Math.pow(numerator / denominator, 2);
        // console.log("START: ", startPoint);
        // console.log("END: ", endPoint);
        // console.log("CUR: ", curPoint);
        // console.log("DISTANCE: ", distance)
        if (distance > curMaxDistance) {
            curMaxDistance = distance;
            curMaxPoint = curPoint;
            curMaxIndex = i;
        }
    }
    if (curMaxPoint) {
        console.log("MAX DISTANCE: ", curMaxDistance)
        return [curMaxPoint, curMaxIndex, curMaxDistance]
    }
    else return null;
}

RDP(pointsArr, EPSILON)