import React, { Component } from "react";

import parse from "html-react-parser";

class TextModule extends Component {
  render() {
    let richText = this.props.element.moduleOptions.data.isRichFormattedText,
      text = this.props.element.moduleOptions.data.textData;
    return (
      <div
        key={this.props.i}
        data-grid={this.props.element}
        style={this.props.style}
      >
        {richText ? parse(text) : text}
      </div>
    );
  }
}

export default TextModule;
