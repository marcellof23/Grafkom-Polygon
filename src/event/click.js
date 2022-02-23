import { offsetLoc } from "../common/const";
var shapes = []; // The array for the position of Triangle with mouse click

function click(ev, gl, canvas) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // Store the coordinates to shapes array
  shapes.push([x, y]);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = shapes.length;
  for (var i = 0; i < len; i++) {
    // Draw
    gl.uniform2f(offsetLoc, shapes[i][0], shapes[i][1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

export { click };
