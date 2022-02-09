import React from "react";
import ViewPage from "../ViewPages/ViewPage";
import PropTypes from "prop-types";

class PageController extends React.Component {

    render() {
        return <ViewPage {...this.props} control={this.control} isDev={process.env.NODE_ENV === 'development'} />
    }
}

export default PageController;

PageController.propTypes = {
    dependencies: PropTypes.object,
    pageData: PropTypes.object,
}
