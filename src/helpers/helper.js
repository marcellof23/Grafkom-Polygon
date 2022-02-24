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

function hex2dec(n) {
  return parseInt(n, 16).toString(10);
}

export { argsToArray, vec2, vec4, flatten, hex2dec };
