import { container, title } from "assets/jss/clear-crm.js";

import modalStyle from "assets/jss/clear-crm/modalStyle.js";
import tooltipsStyle from "assets/jss/clear-crm/tooltipsStyle.js";
import popoverStyles from "assets/jss/clear-crm/popoverStyles.js";
//import { GpsFixed } from "@material-ui/icons";

const javascriptStyles = {
  body: {
    backgroundColor: "pink",
  },
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
    color: "darkcyan",
    "&:hover": {
      color: "#007272",
    },
  },
  testclass: {
    color: "primary",
  },
};

export default javascriptStyles;
