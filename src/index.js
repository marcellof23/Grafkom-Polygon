import _, { fromPairs } from "lodash";
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
import { render_line, createLine } from "./event/line";

import { vec2, vec4, hexTodec, flatten } from "./helpers/helper";
import { ModelGL } from "./model/webgl";

var modelGL;

function createButtonEventListener() {
  var a = document.getElementById("Button1");
  a.addEventListener("click", function () {
    modelGL.numPolygons++;
    modelGL.numIndices[modelGL.numPolygons] = 0;
    modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;
  });
}

function render() {
  modelGL.gl.clear(modelGL.gl.COLOR_BUFFER_BIT);
  for (var i = 0; i <= modelGL.numPolygons; i++) {
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

  modelGL.gl.canvas.width = 0.6 * window.innerWidth;
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
  var menu_features_idx = 0;
  // listeners
  let f = document.getElementById("features-menu");
  f.addEventListener("click", () => {
    featuresIndex = f.selectedIndex;
  });

  let mf = document.getElementById("menu-features");
  mf.addEventListener("click", () => {
    menu_features_idx = mf.selectedIndex;
    if (modelGL.numIndices[modelGL.numPolygons] > 2) {
      modelGL.numPolygons++;
    }
    modelGL.numIndices[modelGL.numPolygons] = 0;
    modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;
  });

  createButtonEventListener();

  modelGL.canvas.addEventListener("mousemove", (e) => {
    const x = (2 * e.clientX) / modelGL.canvas.width - 1;
    const y =
      (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1;
    if (isDrawing) {
      if (menu_features_idx == 0) {
        modelGL.line_end = vec2(x, y);
        render_line(modelGL);
      }
      if (menu_features_idx == 1) {
      }
      if (menu_features_idx == 2) {
      }
      if (menu_features_idx == 3) {
      }
    }
  });
  modelGL.canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      shapes.push(drawnObject);
    }
    if (menu_features_idx == 0) {
      modelGL.numPolygons++;
      modelGL.numIndices[modelGL.numPolygons] = 0;
      modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;
      modelGL.lines.push(createLine(modelGL.line_start, modelGL.line_end));
      modelGL.line_start = [];
      modelGL.line_end = [];
    }
    if (featuresIndex == 1) {
    }
    if (featuresIndex == 2) {
    }
    if (featuresIndex == 3) {
    }
    isDrawing = false;
    drawnObject = null;
    // console.log(shapes);
    console.log("up");
  });

  //Register function on mouse press
  modelGL.canvas.addEventListener("mousedown", (e) => {
    console.log("down");
    console.log(modelGL);
    console.log(menu_features_idx);
    isDrawing = true;

    if (menu_features_idx == 0) {
      modelGL.polygon_idx += 4;
      modelGL.numIndices[modelGL.numPolygons] += 4;

      modelGL.line_end = vec2(
        (2 * e.clientX) / modelGL.canvas.width - 1,
        (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1
      );
      modelGL.line_start = vec2(
        (2 * e.clientX) / modelGL.canvas.width - 1,
        (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1
      );
    }
    if (menu_features_idx == 1) {
      modelGL.polygon_idx++;
    }
    if (menu_features_idx == 2) {
      modelGL.polygon_idx++;
    }
    if (menu_features_idx == 3) {
      var t = vec2(
        (2 * e.clientX) / modelGL.canvas.width - 1,
        (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1
      );
      modelGL.poly_pos.push(flatten(t));
      t = vec4(modelGL.chosen_color);
      modelGL.poly_col.push(flatten(t));

      modelGL.numIndices[modelGL.numPolygons]++;

      render_polygon(e, modelGL);
      modelGL.polygon_idx++;
    }
  });

  var colorInput = document.getElementById("color-input");
  colorInput.addEventListener("change", () => {
    const color = colorInput.value;
    modelGL.chosen_color = [
      hexTodec(color.slice(1, 3)) / 255,
      hexTodec(color.slice(3, 5)) / 255,
      hexTodec(color.slice(5, 7)) / 255,
      1.0,
    ];

    modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);
    var offSet = modelGL.polygon_idx - modelGL.numIndices[modelGL.numPolygons];
    for (var idx = 0; idx < modelGL.numIndices[modelGL.numPolygons]; idx++) {
      modelGL.gl.bufferSubData(
        modelGL.gl.ARRAY_BUFFER,
        (offSet + idx) * 16,
        new Float32Array([
          modelGL.chosen_color[0],
          modelGL.chosen_color[1],
          modelGL.chosen_color[2],
          modelGL.chosen_color[3],
        ])
      );
    }
  });

  let formatJSONPrefix = "data:text/json;charset=utf-8,";
  const exportBtn = document.getElementById("export-button");
  exportBtn.addEventListener("click", () => {
    var string_data =
      formatJSONPrefix + encodeURIComponent(JSON.stringify(modelGL));
    var download_button = document.getElementById("download-link");
    download_button.setAttribute("href", string_data);
    download_button.setAttribute("download", "data.json");
    download_button.click();
  });
  const importBtn = document.getElementById("import-button");
  importBtn.addEventListener("click", () => {
    if (window.FileList && window.FileReader && window.File) {
      uploadBtn.click();
    } else {
      alert("file upload not supported by your browser!");
    }
  });

  const uploadBtn = document.getElementById("upload-button");
  uploadBtn.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const read_file = new FileReader();
    read_file.addEventListener("load", async (e) => {
      try {
        var data = await JSON.parse(e.target.result);
        if (data) {
          modelGL.load_data(data);
          render_data(modelGL);
        }
      } catch (err) {
        alert(`invalid json file\n${err}`);
      }
    });
    read_file.readAsText(file);
  });

  render();
}

function render_data(modelGL) {
  console.log(modelGL);
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  for (var nump = 0; nump < modelGL.numIndices.length; nump++) {
    for (var idx = 0; idx < modelGL.numIndices[nump]; idx++) {
      console.log(modelGL.start[nump] * 8 + idx * 8);
      modelGL.gl.bufferSubData(
        modelGL.gl.ARRAY_BUFFER,
        modelGL.start[nump] * 8 + idx * 8,
        new Float32Array([
          modelGL.poly_pos[modelGL.start[nump] + idx][0],
          modelGL.poly_pos[modelGL.start[nump] + idx][1],
        ])
      );
    }
  }

  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);
  for (var nump = 0; nump < modelGL.numIndices.length; nump++) {
    for (var idx = 0; idx < modelGL.numIndices[nump]; idx++) {
      console.log(modelGL.start[nump] * 16 + idx * 16);
      modelGL.gl.bufferSubData(
        modelGL.gl.ARRAY_BUFFER,
        modelGL.start[nump] * 16 + idx * 16,
        new Float32Array([
          modelGL.poly_col[modelGL.start[nump] + idx][0],
          modelGL.poly_col[modelGL.start[nump] + idx][1],
          modelGL.poly_col[modelGL.start[nump] + idx][2],
          modelGL.poly_col[modelGL.start[nump] + idx][3],
        ])
      );
    }
  }
}

function main() {
  modelGL = new ModelGL();
  init();
}

window.onload = main;
