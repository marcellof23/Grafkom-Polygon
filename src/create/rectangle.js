import { vec2, vec4, flatten } from "../helpers/helper";

import { cindex, colors, start, numIndices } from "../common/const";

function render_rectangle(modelGL) {
    modelGL.gl.bindBuffer(modelGL.gl.ARRAY_BUFFER, modelGL.bufferId);
    let points = createRectangle(modelGL.point_start, modelGL.point_end);
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


function createRectangle(start, end) {
    return [
        start[0], start[1],
        start[0], end[1],
        end[0], end[1],
        end[0], start[1]
    ]
}

export { render_rectangle, createRectangle }