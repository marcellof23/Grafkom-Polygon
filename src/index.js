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
import { render_polygon } from "./create/polygon";
import {
  render_line,
  createLine,
  moveLine,
  render_old_line,
} from "./create/line";

import {
  vec2,
  vec4,
  hexTodec,
  flatten,
  isPointOfShapes,
  leastStartIndex,
  pointIsInPoly,
} from "./helpers/helper";
import { ModelGL } from "./model/webgl";
import { createRectangle, render_rectangle } from "./create/rectangle";
import {
  createSquare,
  moveSquare,
  render_old_square,
  render_square,
} from "./create/square";

import { search_vertices } from "./event/search";
var modelGL;
var BELOW_TRESHOLD;
var chosen_idx, last_pos, chosen_start_idx;
var isChecked;
var polyToggler;

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
  BELOW_TRESHOLD = false;
  isChecked = false;
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
  var menu_features_idx = 0;

  polyToggler = document.getElementById("start-draw");
  polyToggler.addEventListener("change", () => {
    isChecked = polyToggler.checked;
    if (
      modelGL.numIndices[modelGL.numPolygons] > 2 ||
      modelGL.numPolygons == 0
    ) {
      modelGL.numPolygons++;
      modelGL.numIndices[modelGL.numPolygons] = 0;
      modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;
    }
  });

  let mf = document.getElementById("menu-features");
  mf.addEventListener("click", () => {
    menu_features_idx = mf.selectedIndex;
    if (modelGL.numIndices[modelGL.numPolygons] > 2) {
      modelGL.shapes[modelGL.numPolygons] = menu_features_idx;
      modelGL.numPolygons++;
    }
    modelGL.numIndices[modelGL.numPolygons] = 0;
    modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;
  });

  modelGL.canvas.addEventListener("mousemove", (e) => {
    const x = (2 * e.clientX) / modelGL.canvas.width - 1;
    const y =
      (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1;
    document.getElementById("clientX").innerHTML = x.toFixed(2);
    document.getElementById("clientY").innerHTML = y.toFixed(2);
    if (isChecked) {
      if (isDrawing) {
        if (menu_features_idx == 0) {
          modelGL.point_end = vec2(x, y);
          render_line(modelGL);
        }
        if (menu_features_idx == 1) {
          modelGL.point_end = vec2(x, y);
          render_square(modelGL);
        }
        if (menu_features_idx == 2) {
          modelGL.point_end = vec2(x, y);
          render_rectangle(modelGL);
        }
        if (menu_features_idx == 3) {
          modelGL.last_polygon_idx = modelGL.polygon_idx;
          modelGL.last_num = modelGL.numPolygons;
        }
        if (menu_features_idx == 4) {
          if (BELOW_TRESHOLD) {
            modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
            modelGL.gl.bufferSubData(
              modelGL.gl.ARRAY_BUFFER,
              chosen_idx * 8,
              flatten(vec2(x, y))
            );
            last_pos = vec2(x, y);
          }
        }
        if (menu_features_idx == 5 && BELOW_TRESHOLD) {
          modelGL.point_end = vec2(x, y);
          render_old_line(chosen_start_idx, modelGL);
        }
        if (menu_features_idx == 6 && BELOW_TRESHOLD) {
          modelGL.point_end = vec2(x, y);
          render_old_square(chosen_start_idx, modelGL);
        }
      }
    }
  });
  modelGL.canvas.addEventListener("mouseup", (e) => {
    if (isChecked) {
      if (menu_features_idx == 0) {
        modelGL.numPolygons++;
        modelGL.numIndices[modelGL.numPolygons] = 0;
        modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;

        var line = createLine(modelGL.point_start, modelGL.point_end);
        for (let i = 0; i < 4; i++) {
          modelGL.poly_pos.push(flatten(vec2(line[i * 2], line[i * 2 + 1])));
        }

        for (let i = 0; i < 4; i++) {
          modelGL.poly_col.push(colors[0]);
        }

        modelGL.point_start = [];
        modelGL.point_end = [];
      }
      if (menu_features_idx == 1) {
        modelGL.numPolygons++;
        modelGL.numIndices[modelGL.numPolygons] = 0;
        modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;

        var points = createSquare(modelGL.point_start, modelGL.point_end);
        for (let i = 0; i < 4; i++) {
          modelGL.poly_pos.push(
            flatten(vec2(points[i * 2], points[i * 2 + 1]))
          );
        }

        for (let i = 0; i < 4; i++) {
          modelGL.poly_col.push(colors[0]);
        }

        modelGL.point_start = [];
        modelGL.point_end = [];
      }
      if (menu_features_idx == 2) {
        modelGL.numPolygons++;
        modelGL.numIndices[modelGL.numPolygons] = 0;
        modelGL.start[modelGL.numPolygons] = modelGL.polygon_idx;

        var points = createRectangle(modelGL.point_start, modelGL.point_end);
        for (let i = 0; i < 4; i++) {
          modelGL.poly_pos.push(
            flatten(vec2(points[i * 2], points[i * 2 + 1]))
          );
        }

        for (let i = 0; i < 4; i++) {
          modelGL.poly_col.push(colors[0]);
        }

        modelGL.point_start = [];
        modelGL.point_end = [];
      }
      if (menu_features_idx == 3) {
        modelGL.last_polygon_idx = modelGL.polygon_idx;
        modelGL.last_num = modelGL.numPolygons;
      }
      if (menu_features_idx == 4 && BELOW_TRESHOLD) {
        modelGL.poly_pos[chosen_idx] = flatten(last_pos);
      }
      if (menu_features_idx == 5 && BELOW_TRESHOLD) {
        const line = createLine(modelGL.point_start, modelGL.point_end);
        for (let i = 0; i < 4; i++) {
          modelGL.poly_pos[chosen_start_idx + i] = flatten(
            vec2(line[i * 2], line[i * 2 + 1])
          );
        }
        modelGL.point_start = [];
        modelGL.point_end = [];
      }
      if (menu_features_idx == 6 && BELOW_TRESHOLD) {
        const points = createSquare(modelGL.point_start, modelGL.point_end);
        for (let i = 0; i < 4; i++) {
          modelGL.poly_pos[chosen_start_idx + i] = flatten(
            vec2(points[i * 2], points[i * 2 + 1])
          );
        }
        modelGL.point_start = [];
        modelGL.point_end = [];
      }
      isDrawing = false;
      BELOW_TRESHOLD = false;
    }
  });

  //Register function on mouse press
  modelGL.canvas.addEventListener("mousedown", (e) => {
    if (isChecked) {
      isDrawing = true;
      var t = vec2(
        (2 * e.clientX) / modelGL.canvas.width - 1,
        (2 * (modelGL.canvas.height - e.clientY)) / modelGL.canvas.height - 1
      );

      if (menu_features_idx < 3) {
        modelGL.polygon_idx += 4;
        modelGL.numIndices[modelGL.numPolygons] += 4;
        modelGL.shapes[modelGL.numPolygons] = menu_features_idx;

        modelGL.point_start = vec2(t);
        modelGL.point_end = vec2(t);
        console.log(modelGL.point_start, modelGL.point_end);
      }
      if (menu_features_idx == 3) {
        modelGL.poly_pos.push(flatten(t));
        t = vec4(modelGL.chosen_color);
        modelGL.poly_col.push(flatten(t));

        modelGL.numIndices[modelGL.numPolygons]++;
        modelGL.shapes[modelGL.numPolygons] = menu_features_idx;

        render_polygon(e, modelGL);
        modelGL.polygon_idx++;
      }
      if (menu_features_idx == 4) {
        var idx = search_vertices(t, modelGL);
        console.log(idx);
        if (idx != -1) {
          console.log("polygon");
          BELOW_TRESHOLD = true;
          chosen_idx = idx;
          console.log(chosen_idx);
          last_pos = t;
        }
      }
      if (menu_features_idx == 5) {
        const idx = search_vertices(t, modelGL);
        if (idx != -1 && isPointOfShapes(idx, 0, modelGL)) {
          BELOW_TRESHOLD = true;
          chosen_idx = idx;
          console.log(chosen_idx);
          chosen_start_idx = leastStartIndex(idx, modelGL);
          moveLine(chosen_idx, modelGL);
          console.log(modelGL);
        }
      }
      if (menu_features_idx == 6) {
        const idx = search_vertices(t, modelGL);
        if (idx != -1 && isPointOfShapes(idx, 1, modelGL)) {
          BELOW_TRESHOLD = true;
          chosen_idx = idx;
          modelGL.last_polygon_idx = modelGL.polygon_idx;
          modelGL.last_num = modelGL.numPolygons;
          chosen_start_idx = leastStartIndex(idx, modelGL);
          console.log(chosen_idx);
          moveSquare(chosen_idx, modelGL);
        }
      }

      if (menu_features_idx == 7) {
        var idx_poly = 0;
        var poly_pos_to_color = -1;
        var poly_pos_to_color_idx = -1;
        console.log(modelGL);
        for (let i = 0; i < modelGL.numIndices.length; i++) {
          var polygon = [];
          console.log("iop");
          console.log("iop");
          for (let j = 0; j < modelGL.numIndices[i]; j++) {
            console.log(modelGL.poly_pos[0]);
            console.log("iop");
            var p = {
              x: modelGL.poly_pos[idx_poly][0],
              y: modelGL.poly_pos[idx_poly][1],
            };
            polygon.push(p);
            idx_poly++;
          }
          if (polygon.length != 0) {
            var tflat = flatten(t);
            var p_curr = { x: tflat[0], y: tflat[1] };
            console.log(p_curr, polygon);
            if (pointIsInPoly(p_curr, polygon)) {
              poly_pos_to_color = idx_poly - modelGL.numIndices[i];
              poly_pos_to_color_idx = i;
              break;
            }
          }
        }
        modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);
        for (
          var idx = 0;
          idx < modelGL.numIndices[poly_pos_to_color_idx];
          idx++
        ) {
          modelGL.gl.bufferSubData(
            modelGL.gl.ARRAY_BUFFER,
            (poly_pos_to_color + idx) * 16,
            new Float32Array([
              modelGL.chosen_color[0],
              modelGL.chosen_color[1],
              modelGL.chosen_color[2],
              modelGL.chosen_color[3],
            ])
          );
        }
      }
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
  });

  let formatJSONPrefix = "data:text/json;charset=utf-8,";
  const exportBtn = document.getElementById("export-button");
  exportBtn.addEventListener("click", () => {
    if (menu_features_idx == 3) {
      modelGL.numPolygons++;
    }
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
        (modelGL.start[nump] + idx) * 8,
        new Float32Array([
          modelGL.poly_pos[modelGL.start[nump] + idx][0],
          modelGL.poly_pos[modelGL.start[nump] + idx][1],
        ])
      );
    }
  }

  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);
  for (var nump = 0; nump < modelGL.numIndices.length; nump++) {
    console.log(nump);
    for (var idx = 0; idx < modelGL.numIndices[nump]; idx++) {
      console.log(modelGL.start[nump] * 16 + idx * 16);
      modelGL.gl.bufferSubData(
        modelGL.gl.ARRAY_BUFFER,
        (modelGL.start[nump] + idx) * 16,
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
