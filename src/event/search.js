import { euclidean_distance } from "../helpers/helper";

const threshold = 0.05;

function search_vertices(curr_point, modelGL) {
  for (let i = 0; i < modelGL.poly_pos.length; i++) {
    if (
      euclidean_distance(
        modelGL.poly_pos[i][0],
        modelGL.poly_pos[i][1],
        curr_point[0],
        curr_point[1]
      ) < threshold
    ) {
      return i;
    }
  }
  return -1;
}

export { search_vertices };
