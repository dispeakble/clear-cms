import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.9.0";


//import Components from "views/Components/Components.js";
import ViewAuth from "views/ViewAuth/ViewAuth.js";
import LandingPage from "views/LandingPage/LandingPage.js";


function start(){

    let connection = new WebSocket('ws://localhost:8282');
    // listen to onmessage event
    connection.onmessage = evt => {
        // add the new message to state
        console.log(evt.data);
    };

    // for testing purposes: sending to the echo service which will send it back back
    setInterval(_ => {
        connection.send(Math.random())
    }, 2000)

    var hist = createBrowserHistory();

    ReactDOM.render(
        <Router history={hist}>
            <Switch>
                <Route path="/view-auth" component={ViewAuth} />
                <Route path="/" component={LandingPage} />
            </Switch>
        </Router>,
        document.getElementById("root")
    );
}

start();

