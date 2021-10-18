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
      "&:hover > $boxContent" : {
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
  editorButtonWrapper: {

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
  previewIcon: {
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
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
    transition: "opacity 0.3s",
    opacity: "0",
    display: "flex",
    justifyContent: "space-between"
  },
  itemSpeedDial:{
    display: "none"
  },
  removeItemIcon: {
    color: "danger",
  },
  editItemIconWrapper: {
    color: "#008B8B",
  },
  editModuleActionsWrapper: {
    position: "absolute",
    bottom: 0,
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
    marginBottom: "15px",
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
    display: "flex",
    justifyContent: "space-around",
  },
  bottomPane:{
    position: "fixed",
    right: 0,
    bottom: 0
  },
  bodyWrapper: {
    height: "100%",
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
    marginTop: 0,
    padding: "0 10px"
  },
  accordionDetails: {
    justifyContent: "space-between",
    flexDirection: "column",
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
  accordionSummaryRoot:{
    paddingLeft: 0
  },
  accordionSummaryExpanded: {
    marginTop: "0 !important",
    marginBottom: "0 !important",
    minHeight: "0 !important"
  },
  accordionSummaryContent:{
    justifyContent: "space-between",
    margin: 0,
    alignItems: "center"
  },
  dropzoneAreaWrapper: {
  },
  pageOptionsSlider: {
  },
  optionGroup: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "250px",
    minWidth: "150px"
  },
  optionHolder: {
    display: "inline-block",
    minWidth: "32%",
    paddingRight: "10px",
    verticalAlign: "top"
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
  sideMenuEditor: {
    width: "300px",
    height: "calc(100% - 60px)",
    overflowY: "auto",
  },
  sideMenuOption: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
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
