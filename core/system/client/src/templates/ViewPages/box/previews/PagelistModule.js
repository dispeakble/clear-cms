import React, { Component } from "react";


class TextModule extends Component {
    render() {
        let richText = this.props.element.moduleOptions;
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

export default TextModule;
