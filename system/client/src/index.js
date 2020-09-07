import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "assets/scss/clear-crm.scss";

//import Components from "views/Components/Components.js";
import ViewAuth from "views/ViewAuth/ViewAuth.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
//import LandingPage from "views/LandingPage/LandingPage.js";
// salut, sunt ...

function start() {
  /*let connection = new WebSocket('ws://localhost:8282');
    // listen to onmessage event
    connection.onmessage = evt => {
        // add the new message to state
        console.log(evt.data);
    };

    // for testing purposes: sending to the echo service which will send it back back
    setInterval(_ => {
        connection.send(Math.random())
    }, 2000)*/

  var hist = createBrowserHistory();

  ReactDOM.render(
    <BrowserRouter history={hist}>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );
}

start();
