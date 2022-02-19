export function initShaders(gl, vsrc, fsrc) {
  gl.program = twgl.createProgram(gl, [vsrc, fsrc]);
  gl.useProgram(gl.program);
  return gl.program;
}
