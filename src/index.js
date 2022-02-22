import _ from "lodash";
import { initShaders } from "./shaders/init";
import { VSHADER_SOURCE, FSHADER_SOURCE, offsetLoc } from "./shaders/const";
import { click } from "./event/click";
import { initVertexBuffers } from "./shaders/vertex";

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

function canvas() {
  const element = document.createElement("div");
  element.className = "canvas-wrapper";
  element.innerHTML = `<canvas id="webgl" width="600" height="600"></canvas>`;

  return element;
}

window.onload = main;

document.body.appendChild(canvas());
