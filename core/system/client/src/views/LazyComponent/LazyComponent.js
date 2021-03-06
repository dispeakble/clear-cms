import React, { Component } from "react";

class LazyComponent extends Component {
  state = {};
  render() {
    return <h1>I'm just too lazy to load by myself</h1>;
  }
}

export default LazyComponent;
