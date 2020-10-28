/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// @material-ui/icons
//import {Apps, CloudDownload} from "@material-ui/icons";

// core components
//import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/clear-crm/components/headerLinksStyle.js";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import { AccountCircle, Apps, Settings, Web } from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(styles);

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function HeaderLinks(props) {
  let history = useHistory();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const moduleList = [
    {
      //TODO get this from hub module list
      toLink: "/pages",
      name: "Pages",
      icon: "web",
      active: true,
    },
    { toLink: "/categories", icon: "category", name: "Categories" },
    {
      toLink: "/blog",
      icon: "book",
      name: "Blog",
    },
    {
      toLink: "/forum",
      icon: "forum",
      name: "Forum",
    },
    {
      toLink: "/video-conference",
      icon: "video_call",
      name: "Video Conference",
    },
    {
      toLink: "/file-transfer",
      icon: "attachment",
      name: "File Transfer",
    },
    {
      toLink: "/photo-gallery",
      icon: "photo_library",
      name: "Photo Gallery",
    },
  ];

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
            {moduleList.map((module) => (
              <Link to={module.toLink} className={classes.links}>
                <ListItem
                  onClick={() => props.closeDrawer()}
                  className={classes.accordionLinksItem}
                  button
                  activeClassName={module.active ? classes.listItemActive : {}}
                >
                  <ListItemIcon>
                    <Icon>{module.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={module.name} />
                </ListItem>
              </Link>
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

            <ListItem
              onClick={() => {
                props.closeDrawer();
                handlePathChange("/settings/adminProfile");
              }}
              className={classes.accordionLinksItem}
              button
            >
              <ListItemIcon>
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary="Admin Profile" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
