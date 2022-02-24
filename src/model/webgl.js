class ModelGL {
  constructor() {
    this.gl;
    this.canvas;
    this.index = 0;

    this.chosen_color;

    this.bufferId;
    this.cBufferId;

    // polygon
    this.polygons = [];
    this.polygons_move = [];
    this.polygons_color = [];
    this.n_poly = [];
    this.cur_poly = [];
    this.cur_n_poly = 0;
    this.start_poly = false;

    this.mouseClicked = false;
  }

  loadJSONData(data) {
    render(this);
  }
}

export { ModelGL };
