import React from "react";
import { P5 } from "./styles";
import Simulation from "./p5";

export default class Home extends React.Component {
  render() {
    return (
      <P5>
        <h1>Simulação Microestrutural</h1>
        <Simulation />
      </P5>
    );
  }
}
