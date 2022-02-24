class ModelGL {
  constructor() {
    this.gl;
    this.canvas;
    this.index = 0;

    this.chosen_color;

    this.bufferId;
    this.cBufferId;

    this.mouseClicked = false;
  }

  loadJSONData(data) {
    render(this);
  }
}

export { ModelGL };
