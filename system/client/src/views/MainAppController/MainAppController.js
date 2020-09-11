import React, { Component, Suspense } from "react";
import { Route } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";

class MainAppController extends Component {
  state = {};

  hasModule(currentPath, moduleList) {
    const pathObject = currentPath.split("/");
    let componentExists = false;

    moduleList.map((el) => {
      if (el.toLink.replace("/", "") === pathObject[1]) {
        componentExists = true;
      }
    });

    return componentExists;
  }

  render() {
    const { location } = this.props;

    const currentPath = location.pathname;
    const pathnames = this.props.moduleList;
    let LazyComponent;
    if (this.hasModule(currentPath, pathnames)) {
      LazyComponent = React.lazy(() =>
        import(`./ExtraComponents${currentPath}`)
      );
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
