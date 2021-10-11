import React, { Component } from "react";

import parse from "html-react-parser";

class TextModule extends Component {
  render() {
    let richText = this.props.element.moduleOptions.data.isRichFormattedText;
    return (
      <div
        key={this.props.i}
        data-grid={this.props.element}
        style={this.props.style}
      >
        {parse(richText)}
      </div>
    );
  }
}

export default TextModule;
