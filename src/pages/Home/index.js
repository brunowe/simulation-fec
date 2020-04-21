import React from "react";
import { Div, Form } from "./styles";
import Simulation from "./p5";

export default class Home extends React.Component {
  render() {
    return (
      <Div>
        <h1>Simulação Microestrutural</h1>
        <div>
          <Form>
            <input id="ti" placeholder="Temperatura Inicial"></input>
            <input id="tf" placeholder="Temperatura Final"></input>
            <input id="cr" placeholder="Taxa de Resfriamento"></input>
            <button onclick="appForm()">try</button>
          </Form>

          <Simulation />
        </div>
      </Div>
    );
  }
}
