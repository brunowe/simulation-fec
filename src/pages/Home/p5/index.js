import React from "react";
import Sketch from "react-p5";

export default class Simulation extends React.Component {
  x = 100;
  y = 100;
  w = 10;

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  };
  draw = (p5) => {
    p5.background(0);
    p5.ellipse(this.x, this.y, this.w, this.w);
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
    this.w++;
  };

  render() {
    return <Sketch className="sketch" setup={this.setup} draw={this.draw} />;
  }
}
