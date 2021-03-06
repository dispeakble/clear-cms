import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";

class BannerModule extends Component {
  state = {
    title: "",
    width: "",
    height: "",
    link: "",
    target: "",
    bgImage: "",
  };

  render() {
    return (
      <Tooltip title={this.state.title}>
        {this.state.target === "On Page" ? (
          <a href={this.state.link}>
            <img
              style={{
                width: `${this.state.width}px`,
                height: `${this.state.height}px`,
              }}
              src={this.state.bgImage}
              alt={this.state.title}
            />
          </a>
        ) : (
          <Link to={this.state.link}>
            <img
              style={{
                width: `${this.state.width}px`,
                height: `${this.state.height}px`,
              }}
              src={this.state.bgImage}
              alt={this.state.title}
            />
          </Link>
        )}
      </Tooltip>
    );
  }
}

export default withRouter(BannerModule);
