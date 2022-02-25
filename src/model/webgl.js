class ModelGL {
  constructor() {
    this.gl;
    this.canvas;
    this.index = 0;

    this.chosen_color;

    this.bufferId;
    this.cBufferId;

    this.numPolygons = 0;
    this.numIndices = [0];
    this.start = [0];

    this.mouseClicked = false;
  }

  loadJSONData(data) {
    render(this);
  }
}

export { ModelGL };
