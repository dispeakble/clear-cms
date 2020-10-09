import React, { Component, Suspense } from "react";
import { Route } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import ClipLoader from "react-spinners/ClipLoader";

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
    const pathObject = currentPath.split("/");
    let LazyComponent;
    if (this.hasModule(currentPath, pathnames) && !pathObject[2]) {
      LazyComponent = React.lazy(() =>
        import(`./ExtraComponents/${pathObject[1]}`)
      );
    } else {
      LazyComponent = NotFound;
    }
    return (
      <Route
        render={() => (
          <Suspense
            fallback={
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  background: "none",
                }}
              >
                <ClipLoader
                  size={50}
                  color={"#123abc"}
                  loading={true}
                  style={{ background: "none" }}
                />
              </div>
            }
          >
            <LazyComponent />
          </Suspense>
        )}
      />
    );
  }
}

export default MainAppController;
