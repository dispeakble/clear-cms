import React from "react";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {Router} from "react-router-dom";
import ActivityService from "./services/activity.service";
import App from "./App";

import "assets/scss/clear-crm.scss";

import {setChonkyDefaults} from 'chonky';
import {ChonkyIconFA} from 'chonky-icon-fontawesome';

setChonkyDefaults({iconComponent: ChonkyIconFA});

function start() {

    var hist = createBrowserHistory();

    const actServ = new ActivityService();

    actServ.start();

    ReactDOM.render(
        <Router history={hist}>
            <App />
        </Router>,
        document.getElementById("root")
    );
}

start();
