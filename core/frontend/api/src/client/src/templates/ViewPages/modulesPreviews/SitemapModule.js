import React, {Component} from "react";

class SitemapModule extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return(
            <div
                key={this.props.i}
                data-grid={this.props.element}
                style={this.props.style}
            >
                test siteMap
            </div>
        )
    }

}

export default SitemapModule;