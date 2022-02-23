import { vec4 } from "../helpers/helper";
/* Shader Const */

//Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 vPosition;
  attribute vec4 vColor;

  varying vec4 fColor;

  void
  main()
  {
      gl_Position = vPosition;
      fColor = vColor;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 fColor;
  void main() {
    gl_FragColor = fColor;
  }`;

var offsetLoc;

/* Main const*/

var maxNumVertices = 200;
var index = 0;

var cindex = 0;

var colors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(0.0, 1.0, 1.0, 1.0), // cyan
];
var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

export {
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
};
