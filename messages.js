export default {
  messages: {
    default:
      '<p> The <a href="https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm"   >Douglas-Peucker Algorithm</a > is an intuitive, recursive line simplification algorithm. To use this visualizer, first click two points in the blue box. This will be your distance value. Next, create a polyline in the red box by clicking wherever you want the points to go. Once you\'re ready, hit "Run RDP", and your line will be simplified such that no point on the original polyline is further than the length of the line you drew in the blue box from the simplified polyline. Hit "Reset" to start again. </p>',
    firstStep: '<p>First, we draw a line from the start point to the end point.</p>',
    consideringNewLine:
      '<p>The line highlighted in blue is our current potential output. In order to see if this line is an accurate representation of the original polyline, we must make sure that every point between the start point and end point are within a distance of epsilon of this simplified line.</p>',
    calculatingDistance:
      '<p>We go through each point between the start and end of our current line and calculate its distance from the polyline. <br><br> The distance formula we use for this calculation is as follows: if a point is within range of the line, we take its perpindicular distance to the line. If a point is outside of the range of the line, we take its distance to either endpoint that it is closest to.</p>',
    foundFarthestPoint:
      '<p>Next we find the point with the largest distance from the simplified polyline. Here it is highlighted in lime green. We take its distance value and compare it to our epsilon value.</p>',
  },
};
