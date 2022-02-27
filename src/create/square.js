import { vec2, vec4, flatten, euclidean_distance } from "../helpers/helper";

import { cindex, colors, start, numIndices } from "../common/const";

function render_square(modelGL) {
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  let points = createSquare(modelGL.point_start, modelGL.point_end);
  console.log(points);
  for (let i = 0; i < 4; i++) {
    modelGL.gl.bufferSubData(
      modelGL.gl.ARRAY_BUFFER,
      8 * (i + modelGL.start[modelGL.numPolygons]),
      flatten(vec2(points[i * 2], points[i * 2 + 1]))
    );
  }

  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);
  for (let i = 0; i < 4; i++) {
    modelGL.gl.bufferSubData(
      modelGL.gl.ARRAY_BUFFER,
      16 * (i + modelGL.start[modelGL.numPolygons]),
      flatten(vec4(modelGL.chosen_color))
    );
  }
}

function render_old_square(startIdx, modelGL) {
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  let line = createSquare(modelGL.point_start, modelGL.point_end);
  for (let i = 0; i < 4; i++) {
    modelGL.gl.bufferSubData(
      modelGL.gl.ARRAY_BUFFER,
      8 * (i + startIdx),
      flatten(vec2(line[i * 2], line[i * 2 + 1]))
    );
  }
}

function createSquare(start, end) {
    const dx = end[0] - start[0],
        dy = end[1] - start[1],
        adx = Math.abs(dx),
        ady = Math.abs(dy);
    const s = adx > ady ? adx : ady;

    if (dx >= 0 && dy >= 0) {
        return [
            start[0], start[1],
            start[0], start[1] + s,
            start[0] + s, start[1] + s,
            start[0] + s, start[1]
        ]
    }
    
    if (dx >= 0 && dy < 0) {
        return [
            start[0], start[1],
            start[0], start[1] - s,
            start[0] + s, start[1] - s,
            start[0] + s, start[1]
        ]
    }

    if (dx < 0 && dy >= 0) {
        return [
            start[0], start[1],
            start[0], start[1] + s,
            start[0] - s, start[1] + s,
            start[0] - s, start[1]
        ]
    }
    
    return [
        start[0], start[1],
        start[0], start[1] - s,
        start[0] - s, start[1] - s,
        start[0] - s, start[1]
    ]

}

export { render_square, createSquare }