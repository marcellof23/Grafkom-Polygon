import _ from "lodash";
import {
  maxNumVertices,
  cindex,
  colors,
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

var modelGL;
var prevNumPolygons = 0;

function createButtonEventListener() {
  var a = document.getElementById("Button1");

  a.addEventListener("click", function () {
    modelGL.gl.drawArrays(
      modelGL.gl.TRIANGLE_FAN,
      modelGL.start[modelGL.numPolygons],
      modelGL.numIndices[modelGL.numPolygons]
    );

    console.log("oi");

    prevNumPolygons = modelGL.numPolygons;
    modelGL.numPolygons++;
    modelGL.numIndices[modelGL.numPolygons] = 0;
    modelGL.start[modelGL.numPolygons] = modelGL.index;
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

  modelGL.gl.drawArrays(
    modelGL.gl.TRIANGLE_FAN,
    modelGL.start[modelGL.numPolygons],
    modelGL.numIndices[modelGL.numPolygons]
  );

  for (var i = 0; i < modelGL.numPolygons; i++) {
    modelGL.gl.drawArrays(
      modelGL.gl.TRIANGLE_FAN,
      modelGL.start[i],
      modelGL.numIndices[i]
    );
  }

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
    maxNumVertices,
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
    maxNumVertices,
    modelGL.gl.STATIC_DRAW
  );

  var vColor = modelGL.gl.getAttribLocation(program, "vColor");
  modelGL.gl.vertexAttribPointer(vColor, 4, modelGL.gl.FLOAT, false, 0, 0);
  modelGL.gl.enableVertexAttribArray(vColor);

  events();
}

function events() {
  let drawnObject = null;

  // listeners
  let f = document.getElementById("features-menu");
  f.addEventListener("click", () => {
    featuresIndex = f.selectedIndex;
  });

  createButtonEventListener();

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
  modelGL.canvas.addEventListener("mousedown", (e) => {
    render_polygon(e, modelGL);
    isDrawing = true;
    // TODO: add features listener here
    console.log("down");
    modelGL.numIndices[modelGL.numPolygons]++;
    modelGL.index++;
  });

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
