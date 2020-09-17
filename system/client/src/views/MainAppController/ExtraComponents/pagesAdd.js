import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import { AddCircle } from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";

const ReactGridLayout = WidthProvider(RGL);

class PagesAdd extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function () {},
    cols: 12,
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function (i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function (item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString(),
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    const classes = this.props.classes;
    return (
      <React.Fragment>
        <div className={classes.gridLayout}>
          <ReactGridLayout
            layout={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            isBounded={true}
            {...this.props}
          >
            {this.generateDOM()}
          </ReactGridLayout>
        </div>
        <div className={classes.actionsButtons}>
          <Button
            disabled={this.state.isButtonDisabled}
            onClick={this.handleCredentials}
            type="submit"
            color="primary"
            size="lg"
            className={classes.button}
          >
            Edit
          </Button>
          <AddCircle onClick={this.onAddItem} className={classes.addIcon} />
          <Button
            disabled={this.state.isButtonDisabled}
            onClick={this.handleCredentials}
            type="submit"
            color="primary"
            size="lg"
            className={classes.button}
          >
            Save
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagesAdd);
