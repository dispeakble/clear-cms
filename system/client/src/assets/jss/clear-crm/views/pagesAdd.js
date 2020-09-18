import { container, title } from "assets/jss/clear-crm.js";

import modalStyle from "assets/jss/clear-crm/modalStyle.js";
import tooltipsStyle from "assets/jss/clear-crm/tooltipsStyle.js";
import popoverStyles from "assets/jss/clear-crm/popoverStyles.js";
import { GpsFixed } from "@material-ui/icons";

const javascriptStyles = {
  section: {
    padding: "70px 0 0",
  },
  container,
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
  },
  icon: {
    width: "17px",
    height: "17px",
    marginRight: "4px",
  },
  ...modalStyle,
  label: {
    color: "rgba(0, 0, 0, 0.26)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    transition: "0.3s ease all",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingLeft: "0",
    letterSpacing: "normal",
  },
  ...tooltipsStyle,
  ...popoverStyles,
  categoriesPanel: {
    textAlign: "center",
    marginTop: "60px",
  },
  categoriesWrapper: {
    margin: "0 auto",
    width: "80%",
    height: "auto",
    minWidth: "10rem",
  },
  categoryWrapper: {
    display: "inlineBlock",
    float: "left",
    width: "20%",
    backgroundColor: "white",
    padding: "10px",
    border: "1px solid transparent",
    borderRadius: "20px",
    margin: "10px",
  },
  newCategory: {
    fontSize: "2rem",
    border: "1px solid transparent",
    borderRadius: "50px",
    cursor: "pointer",
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
    width: "3rem",
    height: "3rem",
  },
  addButton: {
    fontSize: "2rem",
    border: "1px solid transparent",
    borderRadius: "50px",
    cursor: "pointer",
    width: "3rem",
    height: "3rem",
    color: "darkcyan",
  },
  removeButton: {
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    border: "1px solid transparent",
    borderRadius: "9px",
    cursor: "pointer",
  },
  tableActions: {},
  editAction: {
    color: "darkcyan",
  },
  deleteAction: {
    color: "#FF6461",
  },
  tableCells: {
    fontSize: "90%",
  },
  tableHeader: {
    backgroundColor: "#B2ACAB",
    color: "white",
    fontSize: "100%",
  },
  removeSelectedIcon: {
    color: "#FF6461",
    position: "fixed",
    right: "0",
    bottom: "0",
  },
  deleteSweepIcon: {
    color: "#FF6461",
  },
  addIcon: {
    cursor: "pointer",
    color: "darkcyan",
    fontSize: "400%",
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    "&:hover": {
      color: "#007272",
    },
  },
  previewLayout: {
    position: "fixed",
    left: "0",
    top: "0",
    right: "0",
    bottom: "0",
  },
  gridLayout: {
    position: "relative",
    margin: "60px 30px 0",
    "& .react-grid-item": {
      border: "1px solid rgba(0,0,0,0.14)",
    },
    "& .react-grid-placeholder": {
      background: "rgba(0,0,0,0.14)",
    },
    "& .react-grid-layout ": {
      background: "#FFF",
      marginTop: "10px",
    },
    "& .layoutJSON": {
      background: "#ddd",
      border: "1px solid black",
      marginTop: "10px",
      padding: "10px",
    },
    "& .columns": {
      columns: "120px",
    },
    "& .react-grid-item": {
      boxSizing: "border-box",
    },
    "& .react-grid-item:not(.react-grid-placeholder)": {
      background: "#00acc1",
      border: "1px solid #00649B",
    },
    "& .react-grid-item.resizing": {
      opacity: "0.9",
    },
    "& .react-grid-item.static": {
      background: "#cce",
    },
    "& .react-grid-item .text": {
      fontSize: "24px",
      textAlign: "center",
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      margin: "auto",
      height: "24px",
    },
    "& .react-grid-item .minMax": {
      fontSize: "12px",
    },
    "& .react-grid-item .add": {
      cursor: "pointer",
    },
    "& .react-grid-dragHandleExample": {
      cursor: "move",
      cursor: "grab",
      cursor: "-moz-grab",
      cursor: "-webkit-grab",
    },

    "& .toolbox": {
      backgroundColor: "#dfd",
      width: "100%",
      height: "120px",
      overflow: "scroll",
    },

    "& .hide-button": {
      cursor: "pointer",
      position: "absolute",
      fontSize: "20px",
      top: "0px",
      right: "5px",
    },

    "& .toolbox__title": {
      fontSize: "24px",
      marginBottom: "5px",
    },
    "& .toolbox__items": {
      display: "block",
    },
    "& .toolbox__items__item": {
      display: "inline-block",
      textAlign: "center",
      lineHeight: "40px",
      cursor: "pointer",
      width: "40px",
      height: "40px",
      padding: "10px",
      margin: "5px",
      border: "1px solid black",
      backgroundColor: "#ddd",
    },
    "& .droppable-element": {
      width: "150px",
      textAlign: "center",
      background: "#fdd",
      border: "1px solid black",
      margin: "10px 0",
      padding: "10px",
    },
  },
  addButton: {
    color: "white",
    fontSize: "2rem",
    border: "1px solid transparent",
    borderRadius: "50px",
    padding: 0,
    width: "3rem",
    height: "3rem",
    "&:hover": {
      backgroundColor: "darkcyan",
    },
  },
  actionsButtons: {
    marginTop: "5vh",
    textAlign: "center",
  },
  deleteIcon: {
    borderRadius: "50px",

    color: "#FF6461",
    "&:hover": {
      color: "white",
    },
  },
  pageTitle: {
    padding: "0 10px",
    background: "#FFF",
  },

  // for Hamburger menu
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
  },
  speedDialAction: {
    color: "darkcyan",
  },
  links: {
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
    color: "darkcyan",
    "&:hover": {
      color: "darkcyan",
    },
  },
  previewIcon: {
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
  },
  removeItemIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
};

export default javascriptStyles;
