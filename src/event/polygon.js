import { colors } from "../common/const";
import { vec2, vec4, flatten } from "../helpers/helper";

function eventPolygon(event, modelGL) {
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

  console.log("WARNAAAAAAAAAAAAA");
  console.log(modelGL.chosen_color);

  t = vec4(modelGL.color_chosen);
  modelGL.gl.bufferSubData(
    modelGL.gl.ARRAY_BUFFER,
    16 * modelGL.index,
    flatten(t)
  );
  modelGL.index++;
}

export { eventPolygon };
