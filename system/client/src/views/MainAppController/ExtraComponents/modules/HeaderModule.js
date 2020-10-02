import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";

class HeaderModule extends Component {
  state = {};
  render() {
    return (
      <Button onClick={this.props.showModule} color="primary">
        Edit module options
      </Button>
    );
  }
}

export default HeaderModule;
