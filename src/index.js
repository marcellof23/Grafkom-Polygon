import _ from "lodash";
import { initShaders } from "./shaders/init";
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

function main() {
  // Retrieve  canvas element
  var canvas = document.getElementById("webgl");

  // Get the rendering context
  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  var m = document.getElementById("mymenu");

  m.addEventListener("click", function () {
    cindex = m.selectedIndex;
  });

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

  // Register function on mouse press
  canvas.onmousedown = function (event) {
    eventPolygon(event, canvas, gl, cBufferId, bufferId);

    numIndices[numPolygons]++;
    index++;
  };
  // // color clearing
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  // canvas clearing
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Initialize shaders
  var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("Failed to intialize shaders.");
    return;
  }

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);
  var vPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  var cBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);
  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}

function canvas() {
  const element = document.createElement("div");

  element.className = "canvas-wrapper";
  element.innerHTML = `<canvas id="webgl" width="600" height="600">
  Oops ... your browser doesn't support the HTML5 canvas element
  </canvas>`;

  return element;
}

window.onload = main;

document.body.appendChild(canvas());
