import React, { Component } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
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
    console.log("will set state to " + status);
    this.setState({
      opened: status,
    });
  }

  render() {
    return (
      <SpeedDial
        FabProps={{ size: "small" }}
        ariaLabel="Module Speed Dial"
        icon={<MoreVert />}
        onClose={() => this.toggleState(false)}
        onOpen={() => {
          if (!this.state.force) {
            this.toggleState(true);
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
