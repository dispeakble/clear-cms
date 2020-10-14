import { container, title } from "assets/jss/clear-crm.js";

import modalStyle from "assets/jss/clear-crm/modalStyle.js";
import tooltipsStyle from "assets/jss/clear-crm/tooltipsStyle.js";
import popoverStyles from "assets/jss/clear-crm/popoverStyles.js";
import { GpsFixed } from "@material-ui/icons";

const javascriptStyles = {
  previewBodyWrapper: {
    minHeight: "100%",
    height: "100%",
  },
  gridHolder: {
    width: "100%",
    height: "100%",
  },
  gridLayout: {
    position: "relative",
    top: 0,
    left: 0,
    "& .react-grid-item": {
      border: "1px solid rgba(0,0,0,0.14)",
    },
    "& .react-grid-placeholder": {},
    "& .react-grid-layout ": {},
    "& .layoutJSON": {},
    "& .columns": {},
    "& .react-grid-item": {
      boxSizing: "border-box",
    },
    "& .react-grid-item:not(.react-grid-placeholder)": {},
    "& .react-grid-item.resizing": {
      opacity: "0.9",
    },
    "& .react-grid-item.static": {},
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
  previewItemWrapper: {
    opacity: "0.5",
  },
  logoImage: {
    width: "10%",
  },
  itemWrapper: {
    position: "sticky !important",
    top: 0,
  },
};

export default javascriptStyles;
