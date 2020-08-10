import React from "react";
import Sketch from "react-p5";

export default class Graphic extends React.Component {
  y = 0;
  w = 0;
  a = 1 / 100;
  x;
  i;

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(220, 220).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  };
  draw = (p5) => {
    p5.background(0);
    p5.stroke(255);
    for (this.i = 0; this.i < 200; this.i++) {
      Math.pow(this.i, 2);
      this.y = this.a * Math.pow(this.i, 2);
      this.w = this.a * Math.pow(this.i + 1, 2);
      p5.line(this.i, 200 - this.y, this.i + 1, 200 - this.w);
    }

    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
  };

  render() {
    return <Sketch className="sketch" setup={this.setup} draw={this.draw} />;
  }
}
