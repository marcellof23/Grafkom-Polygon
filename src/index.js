import _ from "lodash";
import {
  maxNumVertices,
  index,
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
import { eventPolygon } from "./event/polygon";
import { vec2, vec4, flatten } from "./helpers/helper";

var gl;
var canvas;

function createColorMenuEventListener() {
  var m = document.getElementById("colorMenu");

  m.addEventListener("click", function () {
    cindex = m.selectedIndex;
  });
}

function createFeaturesMenuEventListener() {
  let m = document.getElementById("features-menu");

  m.addEventListener("click", () => {
    featuresIndex = m.selectedIndex;
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

function draw() {
  // draw tiap gambar tergantung tipenya
  for (const shape of shapes) {
    if (shape[0] === 0) {
      const pBuffer = gl.createBuffer();
      // console.log(shape)
      gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(shape[1]),
        gl.STATIC_DRAW
      );

      const cBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      let t = vec4(colors[cindex]);

      gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(t), gl.STATIC_DRAW);

      gl.drawArrays(gl.LINES, 0, 2);
    }
  }
}

function render() {
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, index);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  draw();

  window.requestAnimFrame(render);
}

function main() {
  // Retrieve  canvas element
  canvas = document.getElementById("webgl");
  // Get the rendering context
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.canvas.width = 0.7 * window.innerWidth;
  gl.canvas.height = window.innerHeight;

  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // color clearing
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  // canvas clearing
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Initialize shaders
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

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

  let drawnObject = null;

  // listeners
  createColorMenuEventListener();

  createFeaturesMenuEventListener();

  createButtonEventListener(gl);

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    // TODO: add features listener here
    console.log("down");
  });

  canvas.addEventListener("mousemove", (e) => {
    const x = (2 * e.clientX) / canvas.width - 1;
    const y = (2 * (canvas.height - e.clientY)) / canvas.height - 1;
    if (isDrawing) {
      if (features[featuresIndex] == "line") {
        if (!drawnObject) {
          drawnObject = [featuresIndex, vec4(x, y, x, y), cindex];
        }
        console.log(drawnObject[1]);
        drawnObject[1].pop();
        drawnObject[1].pop();
        drawnObject[1].push(x, y);
      }
      // TODO: add conditional on others features
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      shapes.push(drawnObject);
    }
    isDrawing = false;
    drawnObject = null;
    console.log("up");
  });

  //Register function on mouse press
  canvas.onmousedown = function (event) {
    eventPolygon(event, canvas, gl, cBufferId, bufferId);

    numIndices[numPolygons]++;
    index++;
  };

  // canvas.addEventListener("click", function (event) {
  //   gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  //   var t = vec2(
  //     (2 * event.clientX) / canvas.width - 1,
  //     (2 * (canvas.height - event.clientY)) / canvas.height - 1
  //   );
  //   gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

  //   gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  //   t = vec4(colors[index % 7]);
  //   gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));
  //   index++;
  // });

  render();
}

window.onload = main;
