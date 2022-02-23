import _ from "lodash";
import {
  VSHADER_SOURCE,
  FSHADER_SOURCE,
  offsetLoc,
  maxNumVertices,
  index,
  cindex,
  colors,
  t,
  numPolygons,
  numIndices,
  start,
} from "./common/const";
import { eventPolygon } from "./event/polygon";
import { argsToArray, vec2, vec4, flatten } from "./helpers/helper";

var gl;

function createMenuEventListener() {
  var m = document.getElementById("colorMenu");

  m.addEventListener("click", function () {
    cindex = m.selectedIndex;
  });
}

function createButtonEventListener(gl) {
  var a = document.getElementById("Button1");
  a.addEventListener("click", function () {
    numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = index;
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < numPolygons; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
  });
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, index);

  window.requestAnimFrame(render);
}

function main() {
  // Retrieve  canvas element
  var canvas = document.getElementById("webgl");
  // Get the rendering context
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.canvas.width = 0.7 * window.innerWidth;
  gl.canvas.height = window.innerHeight;

  // Register function on mouse press
  canvas.onmousedown = function (event) {
    eventPolygon(event, canvas, gl, cBufferId, bufferId);

    numIndices[numPolygons]++;
    index++;
  };

  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // color clearing
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  // canvas clearing
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Initialize shaders
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  createMenuEventListener();

  createButtonEventListener(gl);

  // Create buffer ,set buffer and copy data into a buffer for position
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

  var vPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  // Create buffer ,set buffer and copy data into a buffer for color
  var cBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  canvas.addEventListener("click", function (event) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    var t = vec2(
      (2 * event.clientX) / canvas.width - 1,
      (2 * (canvas.height - event.clientY)) / canvas.height - 1
    );
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    t = vec4(colors[index % 7]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));
    index++;
  });

  render();
}

window.onload = main;
