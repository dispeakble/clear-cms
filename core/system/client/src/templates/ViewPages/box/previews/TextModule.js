import React, { Component } from "react";

import parse from "html-react-parser";

class TextModule extends Component {
  render() {
    const text = this.props.element.moduleOptions.data.textData;
    return (
      <div
        key={this.props.i}
        data-grid={this.props.element}
        style={this.props.style}
      >
        {(text && text.length) ? parse(text) : ""}
      </div>
    );
  }
}

export default TextModule;
