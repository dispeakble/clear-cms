import React, {Component} from "react";

class PagelistModule extends Component {
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
                test pagelist
            </div>
        )
    }

}

export default PagelistModule;