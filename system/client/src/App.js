import React, { Component, Suspense } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import { withRouter } from "react-router-dom";

//import Components from "views/Components/Components.js";
import ViewAuth from "views/ViewAuth/ViewAuth.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";

import "assets/scss/clear-crm.scss";

const LazyComponent = React.lazy(() =>
  import("views/LazyComponent/LazyComponent")
);

class App extends Component {
  state = {};
  render() {
    const currentPath = this.props.location.pathname;
    console.log(currentPath);
    return (
      <React.Fragment>
        <Header
          color="transparent"
          brand="Clear CRM"
          leftLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 10,
            color: "info",
          }}
        />
        <Route
          path="/pages"
          render={() => (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </Suspense>
          )}
        />
        <Switch>
          <Route path="/settings/adminProfile" component={ProfilePage} />
          <Route path="/view-auth" component={ViewAuth} />
          <Route path="/recover-password" component={ViewAuth} />
          <Route path="/" exact component={Dashboard} />
          //leave this always on the last place
          <Route path="/logout" component={ViewAuth} />
          <Route path="/not-found" component={NotFound} />
          {currentPath !== "/pages" ? <Redirect to="/not-found" /> : ""}
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(App);
