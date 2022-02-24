import { vec2, vec4, flatten } from "../helpers/helper";

import {
  cindex,
  colors,
  t,
  numPolygons,
  start,
  numIndices,
} from "../common/const";

function render_polygon(event, modelGL) {
  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
  var t = vec2(
    (2 * event.clientX) / modelGL.canvas.width - 1,
    (2 * (modelGL.canvas.height - event.clientY)) / modelGL.canvas.height - 1
  );
  modelGL.gl.bufferSubData(
    modelGL.gl.ARRAY_BUFFER,
    8 * modelGL.index,
    flatten(t)
  );

  modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.cBufferId);

  if (modelGL.chosen_color == undefined) {
    modelGL.chosen_color = colors[0];
  }

  t = vec4(modelGL.chosen_color);
  modelGL.gl.bufferSubData(
    modelGL.gl.ARRAY_BUFFER,
    16 * modelGL.index,
    flatten(t)
  );
  modelGL.index++;
}

export { render_polygon };
