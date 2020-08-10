import React from "react";
import { Div, Form, Div2, Div3, Wrapper } from "./styles";
import Simulation from "./p5/Simulation";
import Graphic from "./p5/Graphic";

export default class Home extends React.Component {
  render() {
    return (
      <Wrapper>
        <Div>
          <h1>Simulação Microestrutural</h1>
          <Div2>
            <Div3>
              <Form>
                <input id="ti" placeholder="Temperatura Inicial"></input>
                <input id="tf" placeholder="Temperatura Final"></input>
                <input id="cr" placeholder="Taxa de Resfriamento"></input>
                <button onclick="appForm()">try</button>
              </Form>
              <Graphic />
            </Div3>
            <Simulation />
          </Div2>
        </Div>
      </Wrapper>
    );
  }
}
