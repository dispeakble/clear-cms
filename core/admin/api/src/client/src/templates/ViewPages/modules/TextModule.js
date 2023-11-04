import { Component } from "react";

import parse from "html-react-parser";

class TextModule extends Component {
  render() {
    const text = this.props.element.moduleOptions.textData;
    return (
        <div style={this.props.style}>
          {(text && text.length) ? parse(text) : ""}
        </div>
    );
  }
}

export default TextModule;
