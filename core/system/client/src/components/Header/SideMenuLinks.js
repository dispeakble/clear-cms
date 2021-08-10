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
import { withStyles } from "@material-ui/core/styles";

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
      this.setState({
        open: this.props.currentModule.id
      });
    }
  }

  handleCatClick = (cat) => {
    this.setState({ open: cat.id });
  };

  onNavigate(params) {
    this.props.closeDrawer();
    
    this.setState({
      open: params.cat.id
    });

    this.props.onNavigate(params);
  }

  render() {
    const { classes } = this.props;
    return (
        <div style={{minWidth: `250px`}}>
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
                              onClick={this.handleCatClick.bind(this, cat)}
                          >
                            <ListItemIcon>
                              <Icon>{cat.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={cat.name}/>
                            {this.state.open === cat.id ? (
                                <ExpandLess/>
                            ) : (
                                <ExpandMore/>
                            )}
                          </ListItem>
                          <Collapse
                              component="li"
                              in={this.state.open === cat.id}
                              timeout="auto"
                              unmountOnExit
                          >
                            <List disablePadding>
                              {cat.subitems.map((nav) => {
                                return (
                                    <NavLink
                                        onClick={this.onNavigate.bind(this, { cat })}
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
                        <NavLink
                            onClick={this.onNavigate.bind(this, { cat })}
                            key={`nav-${cat.controller}`}
                            to={cat.toLink}
                            className={classes.links}
                            activeStyle={{
                              fontWeight: 900,
                              color: "white",
                              display: "block"
                            }}
                            exact={cat.exact}
                        >
                          <ListItem
                              button
                              key={`subitem-${cat.id}`}
                          >
                            <ListItemIcon>
                              <Icon>{cat.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={cat.name}/>
                          </ListItem>
                        </NavLink>
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
