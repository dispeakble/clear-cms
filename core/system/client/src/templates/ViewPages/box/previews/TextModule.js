import React, { Component } from "react";

import parse from "html-react-parser";

class TextModule extends Component {
  render() {
    const text = this.props.moduleOptions.textData;
    return (
      <div
        key={this.props.i}
        style={this.props.style}
      >
        {(text && text.length) ? parse(text) : ""}
      </div>
    );
  }
}

export default TextModule;
