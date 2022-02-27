import { vec2, vec4, flatten, leastStartIndex, euclidean_distance, midPoint } from "../helpers/helper";

import { cindex, colors, start, numIndices } from "../common/const";

function render_line(modelGL) {
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  let line = createLine(modelGL.point_start, modelGL.point_end);
  for (let i = 0; i < 4; i++) {
    modelGL.gl.bufferSubData(
      modelGL.gl.ARRAY_BUFFER,
      8 * (i + modelGL.start[modelGL.numPolygons]),
      flatten(vec2(line[i * 2], line[i * 2 + 1]))
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

function render_old_line(startIdx, modelGL) {
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  let line = createLine(modelGL.point_start, modelGL.point_end);
  for (let i = 0; i < 4; i++) {
    modelGL.gl.bufferSubData(
      modelGL.gl.ARRAY_BUFFER,
      8 * (i + startIdx),
      flatten(vec2(line[i * 2], line[i * 2 + 1]))
    );
  }
}

function rotate(p1, p2, angle) {
  const rad = (Math.PI / 180) * angle,
    cos = Math.cos(rad),
    sin = Math.sin(rad),
    dx = p2[0] - p1[0],
    dy = p2[1] - p1[1],
    p3 = [cos * dx + sin * dy + p1[0], cos * dy - sin * dx + p1[1]];
  return p3;
}

function createLine(start, end) {
  const width = 0.003,
    deg = (Math.atan2(end[1] - start[1], end[0] - start[0]) * 180) / Math.PI,
    p1 = rotate(start, [start[0], start[1] - width], -deg),
    p2 = rotate(start, [start[0], start[1] + width], -deg),
    p3 = rotate(end, [end[0], end[1] + width], -deg),
    p4 = rotate(end, [end[0], end[1] - width], -deg);

  return [p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]];
}


function moveLine(idx, modelGL) {
  const startIdx = leastStartIndex(idx, modelGL)
  const newPoint1 = midPoint(modelGL.poly_pos[startIdx], modelGL.poly_pos[startIdx+1])
  const newPoint2 = midPoint(modelGL.poly_pos[startIdx+2], modelGL.poly_pos[startIdx+3])
  if (idx - startIdx < 2) {
    modelGL.point_start = newPoint2;
    modelGL.point_end = newPoint1;
    return;
  }
  modelGL.point_start = newPoint1;
  modelGL.point_end = newPoint2;
}

export { render_line, createLine, moveLine, render_old_line };
