class ModelGL {
  constructor() {
    this.gl;
    this.canvas;

    this.bufferId;
    this.cbufferId;

    this.mouseClicked = false;
  }

  loadJSONData(data) {
    render(this);
  }
}
