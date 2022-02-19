import _ from "lodash";

//Vertex shader program
var VSHADER_SOURCE = `
     attribute vec4 a_Position;
     uniform vec2 u_Offset;
     void main() {
       gl_Position = a_Position + vec4(u_Offset, 0, 0);
     }`;

// Fragment shader program
var FSHADER_SOURCE = `
     void main() {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
     }`;

var offsetLoc;

function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

function main() {
  // Retrieve  canvas element
  var canvas = document.getElementById("webgl");

  // Get the rendering context
  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  offsetLoc = gl.getUniformLocation(gl.program, "u_Offset");

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the positions of the vertices");
    return;
  }

  // Register function on mouse press
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas);
  };
  // color clearing
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // canvas clearing
  gl.clear(gl.COLOR_BUFFER_BIT);
}

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

//Make the BO for making triangle
function initVertexBuffers(gl) {
  var vertices = new Float32Array([0.0, 0.1, -0.1, -0.1, 0.1, -0.1]);
  var n = 3;

  //Create a buffer Object
  var positionBuffer = gl.createBuffer();
  if (!positionBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location  of a_Position");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function initShaders(gl, vsrc, fsrc) {
  gl.program = twgl.createProgram(gl, [vsrc, fsrc]);
  gl.useProgram(gl.program);
  return gl.program;
}

function canvas() {
  const element = document.createElement("div");
  element.innerHTML = `<canvas id="webgl"></canvas>`;
  return element;
}
window.onload = main;

document.body.appendChild(component());
document.body.appendChild(canvas());
