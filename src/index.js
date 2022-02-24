import _ from "lodash";
import {
  maxNumVertices,
  cindex,
  colors,
  numPolygons,
  numIndices,
  start,
  featuresIndex,
  isDrawing,
  features,
  shapes,
} from "./common/const";
import { render_polygon } from "./event/polygon";
import { vec4, hex2dec } from "./helpers/helper";
import { ModelGL } from "./model/webgl";
var gl;
var canvas;
var bufferId, cBufferId;
var modelGL;

function createButtonEventListener() {
  var a = document.getElementById("Button1");
  a.addEventListener("click", function () {
    numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = modelGL.index;
    modelGL.gl.clear(modelGL.gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < numPolygons; i++) {
      modelGL.gl.drawArrays(modelGL.gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
  });
}

function draw() {
  // draw tiap gambar tergantung tipenya
  for (const shape of shapes) {
    if (shape[0] === 0) {
      const pBuffer = modelGL.gl.createBuffer();
      // console.log(shape)
      modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, pBuffer);

      modelGL.gl.bufferData(
        modelGL.gl.ARRAY_BUFFER,
        new Float32Array(shape[1]),
        modelGL.gl.STATIC_DRAW
      );

      const cBuffer = modelGL.gl.createBuffer();
      modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, cBuffer);
      let t = vec4(colors[cindex]);

      modelGL.gl.bufferData(
        modelGL.gl.ARRAY_BUFFER,
        new Uint8Array(t),
        modelGL.gl.STATIC_DRAW
      );

      modelGL.gl.drawArrays(modelGL.gl.LINES, 0, 2);
    }
  }
}

function render() {
  modelGL.gl.clear(modelGL.gl.COLOR_BUFFER_BIT);
  modelGL.gl.drawArrays(modelGL.gl.TRIANGLE_FAN, 0, modelGL.index);

  window.requestAnimFrame(render);
}

function init() {
  // Retrieve  canvas element
  modelGL.canvas = document.getElementById("webgl");
  // Get the rendering context
  modelGL.gl = WebGLUtils.setupWebGL(modelGL.canvas);
  if (!modelGL.gl) {
    alert("WebGL isn't available");
  }

  modelGL.gl.canvas.width = 0.7 * window.innerWidth;
  modelGL.gl.canvas.height = window.innerHeight;

  // Set viewport
  modelGL.gl.viewport(0, 0, modelGL.canvas.width, modelGL.canvas.height);

  // color clearing
  modelGL.gl.clearColor(0.8, 0.8, 0.8, 1.0);

  // canvas clearing
  modelGL.gl.clear(modelGL.gl.COLOR_BUFFER_BIT);

  // Initialize shaders
  var program = initShaders(modelGL.gl, "vertex-shader", "fragment-shader");
  modelGL.gl.useProgram(program);

  // Create buffer ,set buffer and copy data into a buffer for position
  modelGL.bufferId = modelGL.gl.createBuffer();
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  modelGL.gl.bufferData(
    modelGL.gl.ARRAY_BUFFER,
    8 * maxNumVertices,
    modelGL.gl.STATIC_DRAW
  );

  var vPos = modelGL.gl.getAttribLocation(program, "vPosition");
  modelGL.gl.vertexAttribPointer(vPos, 2, modelGL.gl.FLOAT, false, 0, 0);
  modelGL.gl.enableVertexAttribArray(vPos);

  // Create buffer ,set buffer and copy data into a buffer for color
  modelGL.cBufferId = modelGL.gl.createBuffer();
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);
  modelGL.gl.bufferData(
    modelGL.gl.ARRAY_BUFFER,
    16 * maxNumVertices,
    modelGL.gl.STATIC_DRAW
  );

  var vColor = modelGL.gl.getAttribLocation(program, "vColor");
  modelGL.gl.vertexAttribPointer(vColor, 4, modelGL.gl.FLOAT, false, 0, 0);
  modelGL.gl.enableVertexAttribArray(vColor);

  events(modelGL);
}

function events() {
  let drawnObject = null;

  // listeners

  let f = document.getElementById("features-menu");
  f.addEventListener("click", () => {
    featuresIndex = f.selectedIndex;
  });

  //createButtonEventListener(modelGL);

  modelGL.canvas.addEventListener("mousemove", (e) => {
    const x = (2 * e.clientX) / modelGL.canvas.width - 1;
    const y =
      (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1;
    if (isDrawing) {
      if (features[featuresIndex] == "line") {
        if (!drawnObject) {
          drawnObject = [featuresIndex, vec4(x, y, x, y), modelGL.cindex];
        }
        console.log(drawnObject[1]);
        drawnObject[1].pop();
        drawnObject[1].pop();
        drawnObject[1].push(x, y);
      }
      // TODO: add conditional on others features
    }
  });

  modelGL.canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      shapes.push(drawnObject);
    }
    isDrawing = false;
    drawnObject = null;
    console.log(shapes);
    console.log("up");
  });

  //Register function on mouse press
  modelGL.canvas.onmousedown = function (event) {
    render_polygon(event, modelGL);
    isDrawing = true;
    // TODO: add features listener here
    console.log("down");
    // numIndices[numPolygons]++;
    // index++;
  };

  var colorInput = document.getElementById("color-input");
  colorInput.addEventListener("change", () => {
    const color = colorInput.value;
    modelGL.chosen_color = [
      hex2dec(color.slice(1, 3)) / 255,
      hex2dec(color.slice(3, 5)) / 255,
      hex2dec(color.slice(5, 7)) / 255,
      1.0,
    ];
  });

  render();
}

function main() {
  modelGL = new ModelGL();
  init();
}

window.onload = main;
