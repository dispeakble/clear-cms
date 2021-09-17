import React, { Component } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
//import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { MoreVert } from "@material-ui/icons";

class MoreMenu extends Component {
  state = {
    opened: false,
    force: false,
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  toggleState(status) {
    this.setState({
      opened: status,
    });
  }

  render() {
    return (
      <SpeedDial
        FabProps={{ size: "small" }}
        direction="down"
        ariaLabel="Module Speed Dial"
        icon={<MoreVert />}
        onClick={() => {
          if (!this.state.force) {
            this.toggleState(!this.state.opened);
          }
          this.setState({
            force: false,
          });
        }}
        open={this.state.opened}
      >
        {this.props.itemActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              this.setState({
                force: true,
              });
              this.toggleState(false);
              action.callback();
            }}
          />
        ))}
      </SpeedDial>
    );
  }
}

export default MoreMenu;
