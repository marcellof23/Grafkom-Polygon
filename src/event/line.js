import { vec2, vec4, flatten } from "../helpers/helper";

import { cindex, colors, start, numIndices } from "../common/const";

function render_line(modelGL) {
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  let line = createLine(modelGL.line_start, modelGL.line_end);
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
      flatten(vec4(colors[0]))
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

export { render_line, createLine };
