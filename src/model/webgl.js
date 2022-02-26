class ModelGL {
  constructor() {
    this.gl;
    this.canvas;
    this.polygon_idx = 0;

    this.chosen_color = [0, 0, 0, 1];

    this.bufferId;
    this.cBufferId;

    this.shapes = [];
    this.drawnObject = null;

    // Polygon
    this.numPolygons = 0;
    this.numIndices = [0];
    this.start = [0];
    this.poly_pos = [];
    this.poly_col = [];

    // Line
    this.line_start = [];
    this.line_end = [];
    this.lines = [];

    this.mouseClicked = false;
  }

  load_data(data) {
    this.polygon_idx = data.polygon_idx;

    this.chosen_color = data.chosen_color;

    // Polygon
    this.numPolygons = data.numPolygons;

    this.numIndices = data.numIndices;
    this.start = data.start;
    this.poly_pos = data.poly_pos;
    this.poly_col = data.poly_col;

    this.mouseClicked = false;
  }
}

export { ModelGL };
