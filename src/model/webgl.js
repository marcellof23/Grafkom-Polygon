class ModelGL {
  constructor() {
    this.gl;
    this.canvas;
    this.polygon_idx = 0;

    this.chosen_color;

    this.bufferId;
    this.cBufferId;

    // Polygon
    this.numPolygons = 0;
    this.numIndices = [0];
    this.start = [0];
    this.last_pos;
    this.poly_pos = [];
    this.poly_col = [];

    this.mouseClicked = false;
  }

  loadJSONData(data) {
    this.polygon_idx = data.polygon_idx;

    this.chosen_color = data.chosen_color;

    // Polygon
    this.numPolygons = data.numPolygons;

    this.numIndices = data.numIndices;
    this.start = data.start;
    this.last_pos = data.last_pos;
    this.poly_pos = data.poly_pos;
    this.poly_col = data.poly_col;

    this.mouseClicked = false;
  }
}

export { ModelGL };
