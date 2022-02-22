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

export { initVertexBuffers };
