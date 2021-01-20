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
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
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
    return createMuiTheme({
      palette: this.props.defaultTheme,

      overrides: {},
    });
  };

  render() {
    let items = this.props.moduleList;
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={this.getTheme()}>
        <div>
          {items.list.map((list) => {
            return (
              <List
                className={classes.root}
                key={`list-${list.id}`}
                subheader={<ListSubheader>{list.title}</ListSubheader>}
              >
                {list.items.map((item) => {
                  return (
                    <div key={`cat-${list.id}-${item.id}`}>
                      {item.subitems != null ? (
                        <div>
                          <ListItem
                            button
                            onClick={this.handleClick.bind(this, item.name)}
                          >
                            <ListItemIcon>
                              <Icon>{item.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                            {this.state[item.name] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItem>
                          <Collapse
                            component="li"
                            in={this.state[item.name]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List disablePadding>
                              {item.subitems.map((sitem) => {
                                return (
                                  <NavLink
                                    key={`nav-${sitem.name}`}
                                    to={sitem.toLink}
                                    className={classes.links}
                                    activeStyle={{
                                      fontWeight: 900,
                                      color: "white",
                                    }}
                                  >
                                    <ListItem
                                      onClick={this.props.closeDrawer}
                                      button
                                      className={classes.nested}
                                    >
                                      <ListItemIcon>
                                        <Icon>{sitem.icon}</Icon>
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={sitem.name}
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
                          onClick={this.handleClick.bind(this, item.name)}
                          key={`subitem-${item.id}`}
                        >
                          <ListItemText primary={item.name} />
                        </ListItem>
                      )}
                    </div>
                  );
                })}
                <Divider key={`divider-${list.id}`} absolute />
              </List>
            );
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
