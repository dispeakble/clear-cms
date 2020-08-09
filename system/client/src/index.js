import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.9.0";


//import Components from "views/Components/Components.js";
import ViewAuth from "views/ViewAuth/ViewAuth.js";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/view-auth" component={ViewAuth} />
      {/*<Route path="/" component={Components} />//hehe.getridofthis*/}
    </Switch>
  </Router>,
  document.getElementById("root")
);
