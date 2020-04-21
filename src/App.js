import React from "react";

import { Router } from "react-router-dom";

import { Routes } from "./routes";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes />
        <h1>olá</h1>
      </Router>
    );
  }
}
