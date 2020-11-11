import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "assets/scss/clear-crm.scss";

function start() {

  var hist = createBrowserHistory();

  ReactDOM.render(
    <BrowserRouter history={hist}>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );
}

start();
