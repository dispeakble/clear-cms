import React, { Component, Suspense } from "react";
import { Route } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import ClipLoader from "react-spinners/ClipLoader";

class MainController extends Component {
    state = {};

    hasModule(currentPath, moduleList) {
        const pathObject = currentPath.split("/");
        let componentExists = false;

        moduleList.map((el) => {
            if(el.subitems){
                el.subitems.map((item) => {
                    if (item.toLink.replace("/", "") === pathObject[1]) {
                        componentExists = true;
                    }
                    return item;
                })
            }

            return el;
        });

        return componentExists;
    }

    render() {
        const { location } = this.props;

        const currentPath = location.pathname;
        const pathnames = this.props.moduleList;
        const pathObject = currentPath.substring(1).split("/");
        this.props.location.pathObject = pathObject;
        let LazyComponent;
        if (this.hasModule(currentPath, pathnames)) {
            LazyComponent = React.lazy(() =>
                import(`./${pathObject[0]}.controller`)
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
                        <LazyComponent
                            {...this.props}
                            hist={this.props.history}
                        />
                    </Suspense>
                )}
            />
        );
    }
}

export default MainController;