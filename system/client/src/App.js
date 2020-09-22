import React, { Component, Suspense } from "react";
import ReactDOM from "react-dom";
import { withRouter, Route, Switch } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";

//import Components from "views/Components/Components.js";
import ViewAuth from "views/ViewAuth/ViewAuth.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import MainAppController from "views/MainAppController/MainAppController";
import PagesAdd from "views/MainAppController/ExtraComponents/pagesAdd";
import PagePreview from "views/MainAppController/ExtraComponents/pagePreview";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "assets/scss/clear-crm.scss";

class App extends Component {
  state = {
    moduleList: [
      {
        //TODO get this from hub module list
        toLink: "/pages",
        name: "Pages",
        icon: "web",
        active: true,
      },
      {
        toLink: "/categories",
        name: "Categories",
        icon: "category",
      },
      {
        toLink: "/blog",
        icon: "book",
        name: "Blog",
      },
      {
        toLink: "/forum",
        icon: "forum",
        name: "Forum",
      },
      {
        toLink: "/video-conference",
        icon: "video_call",
        name: "Video Conference",
      },
      {
        toLink: "/file-transfer",
        icon: "attachment",
        name: "File Transfer",
      },
      {
        toLink: "/photo-gallery",
        icon: "photo_library",
        name: "Photo Gallery",
      },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <Header
          color="transparent"
          brand="Clear CRM"
          leftLinks={<HeaderLinks moduleList={this.state.moduleList} />}
          fixed
          changeColorOnScroll={{
            height: 10,
            color: "info",
          }}
        />

        <Switch>
          <Route path="/settings/adminProfile" component={ProfilePage} />
          <Route path="/view-auth" component={ViewAuth} />
          <Route path="/recover-password" component={ViewAuth} />
          <Route path="/" exact component={Dashboard} />
          //leave this always on the last place
          <Route path="/logout" component={ViewAuth} />
          <Route path="/pagesAdd" component={PagesAdd} />
          <Route path="/pagePreview" component={PagePreview} />
          <Route
            render={(props) => (
              <MainAppController
                {...props}
                moduleList={this.state.moduleList}
              />
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
