import { transition, boxShadow, drawerWidth } from "assets/jss/clear-crm.js";

const javascriptStyles = {
  gridLayout: {
    margin: "0 15px 0",
    "& .react-grid-item": {
      border: "1px solid rgba(0,0,0,0.14)",
      boxSizing: "border-box",
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
      cursor: "move"
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
  },

  // for the 2 icons on the right side of the page

  iconsWrapper: {
    flex: "0 0 112px",
    width: "112px",
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
  previewIcon: {
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
  },
  itemSpeedDialWrapper: {
    position: "absolute",
    top: "0.5rem",
    right: 0,
  },
  removeItemIcon: {
    color: "#F44336",
  },
  editItemIconWrapper: {
    color: "#008B8B",
  },
  editModuleActionsWrapper: {
    position: "absolute",
    bottom: 0,
    height: "48px",
    right: 0,
    left: 0,
  },
  editModuleIconWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  editItemIcon: {
    color: "darkcyan",
  },
  option: {
    width: "100%",
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  sideMenuActionHolder: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    width: "80%",
    margin: "0 auto",
  },
  savePageButton: {
    position: "fixed",
    right: "13rem",
    bottom: "1rem",
  },
  cancelPageButton: {
    position: "fixed",
    right: "6rem",
    bottom: "1rem",
  },
  bodyWrapper: {
    background: "white",
  },
  textfield: {
    fontSize: "10rem",
    color: "gold",
  },
  column: {
    flexBasis: "32.66%",
  },
  columnSeparator: {
    borderRight: "1px solid darkcyan",
    paddingRight: "1%",
  },
  accordion: {
    overflow: "visible",
  },
  accordionDetails: {
    "& div h4": {
      textAlign: "center",
      fontWeight: "400",
    },
    "& div h5": {
      fontSize: "100%",
      fontWeight: "400",
    },
    "& > p": {
      width: "1%",
    },
  },
  dropzoneAreaWrapper: {
    width: "90%",
    margin: "0 auto",
  },
  pageOptionsSlider: {
    width: "80%",
    marginLeft: "10%",
  },

  sideMenu: {
    "& h3": {
      textAlign: "center",
      marginBottom: "50px",
    },
  },
  sideMenuSlider: {
    width: "100%",
  },
  sideMenuEditorForm: {
    width: "80%",
    margin: "0 auto",
  },
  sideMenuEditor: {
    width: "300px",
    height: "calc(100% - 60px)",
    overflowY: "auto",
  },
  typography: {
    fontSize: "120%",
  },
  MenuModule: {
    margin: "0",
    listStyle: "none",
    "& a": {
      display: "block",
      padding: "0 5px",
      lineHeight: "15px",
    },
    "& li": {
      padding: "0",
      marginLeft: "5px",
    },
    "& li:hover": {
      background: "rgba(255,255,255,0.15)",
    },
  },
  MenuModuleHorizontal: {
    "& li": {
      display: "inline-block",
      marginLeft: "0",
    },
  },
  addIcon: {
    color: "darkcyan",
    fontSize: "130%",
    "&:hover": {
      color: "#007272",
    },
  },
  dropzoneColumn: {
    width: "50%",
    display: "inline-block",
    padding: "1rem",
    verticalAlign: "text-top",
  },
};

export default javascriptStyles;
