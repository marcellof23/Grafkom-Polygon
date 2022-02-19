import _ from "lodash";
import { initShaders } from "./shaders/init";
import { VSHADER_SOURCE, FSHADER_SOURCE, offsetLoc } from "./shaders/const";
import { click } from "./event/click";

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

function canvas() {
  const element = document.createElement("div");
  element.innerHTML = `<canvas id="webgl"></canvas>`;
  return element;
}
window.onload = main;

document.body.appendChild(canvas());
