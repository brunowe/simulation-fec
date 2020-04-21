import React from "react";
import { P5 } from "./styles";
import Sketch from "react-p5";
// import { Container } from './styles';

export default class Home extends React.Component {
  x = 50;
  y = 50;

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  };
  draw = (p5) => {
    p5.background(0);
    p5.ellipse(this.x, this.y, 70, 70);
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
    this.x++;
  };

  render() {
    return (
      <P5>
        <h1>Simulação Microestrutural</h1>
        <Sketch className="sketch" setup={this.setup} draw={this.draw} />
      </P5>
    );
  }
}
