import React from "react";
import PropTypes from "prop-types";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import { NavLink } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import Divider from "@material-ui/core/Divider";
const styles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  links: {
    "&:link": {
      color: "black",
    },
  },
});
class NestedList extends React.Component {
  state = {};
  handleClick = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  getTheme = () => {
    return createTheme({
      palette: this.props.defaultTheme,

      overrides: {},
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={this.getTheme()}>
        <div>
          {this.props.moduleList.map((cat) => {
            return (
                <List
                    className={classes.root}
                    key={`list-${cat.id}`}
                    subheader={<ListSubheader>{cat.title}</ListSubheader>}
                >
                  <div key={`cat-${cat.id}`}>
                    {cat.subitems != null ? (
                        <div>
                          <ListItem
                              button
                              onClick={this.handleClick.bind(this, cat.name)}
                          >
                            <ListItemIcon>
                              <Icon>{cat.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={cat.name}/>
                            {this.state[cat.name] ? (
                                <ExpandLess/>
                            ) : (
                                <ExpandMore/>
                            )}
                          </ListItem>
                          <Collapse
                              component="li"
                              in={this.state[cat.name]}
                              timeout="auto"
                              unmountOnExit
                          >
                            <List disablePadding>
                              {cat.subitems.map((nav) => {
                                return (
                                    <NavLink
                                        key={`nav-${nav.name}`}
                                        to={nav.toLink}
                                        className={classes.links}
                                        activeStyle={{
                                          fontWeight: 900,
                                          color: "white",
                                          backgroundColor: "#006C6C",
                                          display: "block"
                                        }}
                                    >
                                      <ListItem
                                          onClick={this.props.closeDrawer}
                                          button
                                          className={classes.nested}
                                      >
                                        <ListItemIcon>
                                          <Icon>{nav.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={nav.name}
                                        />
                                      </ListItem>
                                    </NavLink>
                                );
                              })}
                            </List>
                          </Collapse>{" "}
                        </div>
                    ) : (
                        <ListItem
                            button
                            onClick={this.handleClick.bind(this, cat.name)}
                            key={`subitem-${cat.id}`}
                        >
                          <ListItemText primary={cat.name}/>
                        </ListItem>
                    )}
                  </div>
                  <Divider key={`divider-${cat.id}`} absolute/>
                </List>
            )
          })}
        </div>
      </MuiThemeProvider>
    );
  }
}
NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NestedList);
