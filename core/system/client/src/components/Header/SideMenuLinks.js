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
    "&:link.active": {
      backgroundColor: theme.palette.primary.main,
    },
  },
});
class NestedList extends React.Component {
  state = {};

  componentDidMount() {
    if(this.props.currentModule) {
      const selectedState = {};
      selectedState[this.props.currentModule.name] = true;
      this.setState(selectedState);
    }
  }

  handleClick = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  onNavigate(e) {
    const navPayload = this.props.moduleList.find((module) => {
      let foundItem = false;
      module.subitems.forEach(item => {
        if(e.currentTarget.href.indexOf(item.toLink) > -1) {
          foundItem = true;
        }
      });
      return foundItem
    });
    const selectedState = {};
    selectedState[navPayload.name] = true;
    this.setState(selectedState);
    this.props.onNavigate(navPayload);
  }

  render() {
    const { classes } = this.props;
    return (
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
                                        onClick={this.onNavigate.bind(this)}
                                        key={`nav-${nav.name}`}
                                        to={nav.toLink}
                                        className={classes.links}
                                        activeStyle={{
                                          fontWeight: 900,
                                          color: "white",
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
    );
  }
}
NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
  onNavigate: PropTypes.func,
};
export default withStyles(styles)(NestedList);
