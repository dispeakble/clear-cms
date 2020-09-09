import React, { Component, Suspense } from "react";
import { Route } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";

class MainAppController extends Component {
  state = {};

  hasModule(url, moduleList) {
    const urlObj = url.split("/");
    let response = false;

    moduleList.map((el) => {
      if (el.toLink.replace("/", "") === urlObj[0]) {
        response = true;
      }
    });

    return response;
  }

  render() {
    const { location } = this.props;

    const currentPath = location.pathname;
    const pathnames = this.props.moduleList;
    let LazyComponent;
    if (this.hasModule(currentPath, pathnames)) {
      LazyComponent = React.lazy(() => import(`.${currentPath}`));
    } else {
      LazyComponent = NotFound;
    }
    return (
      <Route
        render={() => (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
          </Suspense>
        )}
      />
    );
  }
}

export default MainAppController;
