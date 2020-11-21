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

EPSILON = 0.12

var pointsArr = []
var pointCircles = []
var blackLines = []




var svgContainer = d3.select("body")
    .append("svg")
    .attr("style", "outline: thin solid red")
    .attr("width", 1800)
    .attr("height", 900);

// var circles = svgContainer
//     .selectAll("circle")
//     .data(pointCircles)
//     .enter()
//     .append("circle");

// This click handler is based on the handler from http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
svgContainer.on("click", (event) => {
    var coords = d3.pointer(event);

    // Normally we go from data to pixels, but here we're doing pixels to data
    var clickCoords= [
      Math.round(coords[0]),  // Takes the pixel number to convert to number
      Math.round(coords[1])
    ];

    pointsArr.push([
        clickCoords[0], clickCoords[1]
    ])

    pointCircles.push({
        "x_axis": clickCoords[0],
        "y_axis": clickCoords[1],
        "radius": 6,
        "color": "black",
    }); 

    if (pointsArr.length > 1) {
        const endIndex = pointCircles.length -1
        blackLines.push({
            "id": "a"+pointsArr[endIndex-1].toString().replace(',', '')+ pointsArr[endIndex].toString().replace(',', ''),
            "x1": pointsArr[endIndex-1][0],
            "y1": pointsArr[endIndex-1][1],
            "x2": pointsArr[endIndex][0],
            "y2": pointsArr[endIndex][1],
        });
    }
    console.log("BLACK LINES: ", blackLines)

    var circles = svgContainer.selectAll("circle")  // For new circle, go through the update process
        .data(pointCircles)
        .enter()
        .append("circle");

    var circleAttributes = circles
        .attr("cx", d => d.x_axis)
        .attr("cy", d => d.y_axis)
        .attr("r", d => d.radius)
        .style("fill", d => d.color);  

    var lines = svgContainer.selectAll("line")
        .data(blackLines)
        .enter()
        .append("line")

    var lineAttributes = lines
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("id", d => d.id)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2);
})

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
    console.log("TEMP: ", temp)
    if (temp) {
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
            console.log("RECURSIVE CALLS BEING MADE")
            RDP(points.slice(0, furthestPointIndex+1), epsilon)
            RDP(points.slice(furthestPointIndex, points.length), epsilon)
        }
        return
    }
}

function findFurthestPoint(points) {
    // points should be an (ordered) array of (x,y) coordinates
    // returns furthest point from the line connecting the first and last point
    // based on distance formula found in http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.17.6932

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

function start() {
    svgContainer.selectAll("line")
        .attr("stroke-dasharray", "10,10")
    RDP(pointsArr, EPSILON);
}


function reset() {
    pointsArr = [];
    pointCircles = [];
    blackLines = [];

    svgContainer
        .selectAll('*')
        .remove();
}