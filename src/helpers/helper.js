function argsToArray(args) {
  return [].concat.apply([], Array.prototype.slice.apply(args));
}

function vec2() {
  var result = argsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
  }

  return result.splice(0, 2);
}

function vec4() {
  var result = argsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
    case 3:
      result.push(1.0);
  }

  return result.splice(0, 4);
}

function flatten(v) {
  if (v.matrix === true) {
    v = transpose(v);
  }

  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  var floats = new Float32Array(n);

  if (elemsAreArrays) {
    var idx = 0;
    for (var i = 0; i < v.length; ++i) {
      for (var j = 0; j < v[i].length; ++j) {
        floats[idx++] = v[i][j];
      }
    }
  } else {
    for (var i = 0; i < v.length; ++i) {
      floats[i] = v[i];
    }
  }

  return floats;
}

function hexTodec(n) {
  return parseInt(n, 16).toString(10);
}

function rotate(p1, p2, angle) {
  const rad = (Math.PI / 180) * angle,
        cos = Math.cos(rad),
        sin = Math.sin(rad),
        dx = p2[0] - p1[0],
        dy = p2[1] - p1[1],
        p3 = [(cos * dx) + (sin * dy) + p1[0], (cos * dy) - (sin * dx ) + p1[1]];
  return p3

}

function createLine(start, end) {
  const width = 0.003,
        deg = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI,
        p1 = rotate(start, [start[0], start[1] - width], -deg),
        p2 = rotate(start, [start[0], start[1] + width], -deg),
        p3 = rotate(end, [end[0], end[1] + width], -deg),
        p4 = rotate(end, [end[0], end[1] - width], -deg);
  
  return [
    p1[0], p1[1],
    p2[0], p2[1],
    p3[0], p3[1],
    p4[0], p4[1]
  ]
}


export { argsToArray, vec2, vec4, flatten, hexTodec, createLine};
