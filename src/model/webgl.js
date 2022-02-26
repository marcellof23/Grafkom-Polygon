class ModelGL {
  constructor() {
    this.gl;
    this.canvas;
    this.polygon_idx = 0;

    this.chosen_color;

    this.bufferId;
    this.cBufferId;

    // Polygon

    // numPolygons is attribute for tracking how many object
    this.numPolygons = 0;

    // numIndices is attribute for tracking how many vertex used in the object
    this.numIndices = [0];

    // start is attribute that give information about starting index in the buffer
    // for example, you have one 3 points polygon, and another 3 points polygon, so the
    // start will be [0, 3]
    this.start = [0];

    // poly_pos is an array of vector points that include all the point in the buffer
    this.poly_pos = [];

    // poly_pos is an array of vector color that include all the color value in the buffer
    this.poly_col = [];

    this.lines = [];
    this.line_start = [];
    this.line_end = [];

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
