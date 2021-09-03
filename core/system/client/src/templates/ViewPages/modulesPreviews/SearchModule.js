import React, { Component } from "react";

class SearchModule extends Component {
    render() {
        let richText = this.props.element.moduleOptions.data;
        return (
            <div
                key={this.props.i}
                data-grid={this.props.element}
                style={this.props.style}
            >
                {richText.toString()}
            </div>
        );
    }
}

export default SearchModule;
