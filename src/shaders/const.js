//Vertex shader program
var VSHADER_SOURCE = `
     attribute vec4 a_Position;
     uniform vec2 u_Offset;
     void main() {
       gl_Position = a_Position + vec4(u_Offset, 0, 0);
     }`;

// Fragment shader program
var FSHADER_SOURCE = `
     void main() {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
     }`;

var offsetLoc;

export { VSHADER_SOURCE, FSHADER_SOURCE, offsetLoc };
