import React from "react";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import SectionEdition from "../component/section-edition";
import SectionPreview from "../component/section-preview";
import DownloadButton from "../component/download-button";

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
  edition: {},
  preview: {
    flex: 3,
  },
  button: {
    position: "relative",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

class Editor extends React.Component {
  state = {
    showMenu: true,
    theme: createMuiTheme(this.props.currentTheme),
    view: "desktop",
  };

  handleChangeTheme = (theme) => this.setState({ theme });

  handleChangeView = (view) => this.setState({ view });

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.root}>
        <SectionEdition
          style={{ display: this.props.visibleMenu ? "block" : "none" }}
          rootClassName={classes.edition}
          onChange={this.handleChangeTheme}
          theme={this.state.theme}
        />
        <SectionPreview
          rootClassName={classes.preview}
          onChange={this.handleChangeView}
          theme={this.state.theme}
          view={this.state.view}
        />
        {/* <DownloadButton
          rootClassName={classes.button}
          theme={this.state.theme}
        /> */}
      </main>
    );
  }
}

export default withStyles(styles)(Editor);
