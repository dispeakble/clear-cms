//import { transition, boxShadow, drawerWidth } from "assets/jss/clear-crm.js";
import modalStyle from "assets/jss/clear-crm/modalStyle.js";

const javascriptStyles = {
  body:{},
  ...modalStyle,
  gridLayout: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0 15px 0",
    "& .react-grid-item": {
      boxSizing: "border-box",
      "&:hover $boxControls" : {
        opacity: 1,
        "& $itemSpeedDialWrapper": {
          display: "flex"
        }
      }
    },
    "& .react-grid-placeholder": {},
    "& .react-grid-layout ": {
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
    "& .react-grid-item:not(.react-grid-placeholder)": {
      background: "#FFFFFF",
    },
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
  pageTitleInputWrapper: {
    marginTop: "5px",
    padding: "0",
    background: "#FFF",
    display: "flex",
    justifyContent: "space-between",
    "& > :not(:last-child)" : {
      paddingRight: "15px"
    }
  },

  // for the 2 icons on the right side of the page

  iconsWrapper: {
    flex: "0 0 1",
    width: "auto",
    whiteSpace: "nowrap",
  },
  rightSideIcon: {
    fontSize: "2rem",
  },

  // for Hamburger menu
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  itemSpeedDialWrapper: {
    display: "none"
  },
  pageSpeedDial: {
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
    width: "5%",
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
  renderBoxTitle: {
    zIndex: "-1",
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    overflow: "hidden",
    "& > h1": {
      color: "rgba(0,0,0,0.2)"
    }
  },
  boxContent: {
    position: "relative"
  },
  boxControls: {
    transition: "opacity 0.3s",
    opacity: 0,
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  moduleContent: {
    position: "absolute",
    zIndex: 9,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  itemSpeedDial:{
    display: "none"
  },
  bodyWrapper: {
    height: "100%"
  },
};

export default javascriptStyles;
