import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import App from "./App";

import "assets/scss/clear-crm.scss";

import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
setChonkyDefaults({ iconComponent: ChonkyIconFA });

function start() {

  var hist = createBrowserHistory();

  ReactDOM.render(
    <Router history={hist}>
      <App />
    </Router>,
    document.getElementById("root")
  );
}

start();
