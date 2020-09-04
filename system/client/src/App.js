import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";

//import Components from "views/Components/Components.js";
import ViewAuth from "views/ViewAuth/ViewAuth.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";

import "assets/scss/clear-crm.scss";

function App() {
  return (
    <React.Fragment>
      <Header
        color="transparent"
        brand="Clear CRM"
        leftLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
      />
      <Switch>
        <Route path="/settings/adminProfile" component={ProfilePage} />
        <Route path="/view-auth" component={ViewAuth} />
        <Route path="/recover-password" component={ViewAuth} />
        <Route path="/" exact component={Dashboard} />
        //leave this always on the last place
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
      <Footer />
    </React.Fragment>
  );
}

export default App;
