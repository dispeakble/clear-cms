/*eslint-disable*/
import React from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import styles from "assets/jss/clear-crm/components/headerLinksStyle.js";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Apps, Settings, Web } from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(styles);

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function HeaderLinks(props) {
  let history = useHistory();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePathChange = (path) => {
    history.push(`${path}`);
  };

  return (
    <div className={classes.linksContainer}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          className={classes.menuCategory}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <ListItemIcon>
            <Apps />
          </ListItemIcon>
          <Typography className={classes.heading}>All Modules</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className={classes.accordion}>
          <List className={classes.accordionLinks}>
            {props.moduleList.map((module) => (
              <NavLink
                key={module.name}
                to={module.toLink}
                className={classes.links}
              >
                <ListItem
                  onClick={() => props.closeDrawer()}
                  className={classes.accordionLinksItem}
                  button
                  style={{ backgroundColor: "inherit" }}
                >
                  <ListItemIcon>
                    <Icon>{module.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={module.name} />
                </ListItem>
              </NavLink>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          className={classes.menuCategory}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <Typography className={classes.heading}>Settings</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className={classes.accordion}>
          <List className={classes.accordionLinks}>
            <ListItem
              onClick={() => {
                props.closeDrawer();
                handlePathChange("/settings/general");
              }}
              className={classes.accordionLinksItem}
              button
            >
              <ListItemIcon>
                <Icon>settings</Icon>
              </ListItemIcon>
              <ListItemText primary="General Settings" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
