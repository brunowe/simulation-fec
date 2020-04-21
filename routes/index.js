import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Redirect to="/" />
    </Switch>
  );
}
