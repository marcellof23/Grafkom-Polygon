import { vec2, vec4, flatten } from "../helpers/helper";

import {
  index,
  cindex,
  colors,
  t,
  numPolygons,
  start,
  numIndices,
} from "../common/const";

function eventPolygon(event, canvas, gl, cBufferId, bufferId) {
  t = vec2(
    (2 * event.clientX) / canvas.width - 1,
    (2 * (canvas.height - event.clientY)) / canvas.height - 1
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

  t = vec4(colors[cindex]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));
}

export { eventPolygon };
