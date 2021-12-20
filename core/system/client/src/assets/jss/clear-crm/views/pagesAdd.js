//import { transition, boxShadow, drawerWidth } from "assets/jss/clear-crm.js";
import modalStyle from "assets/jss/clear-crm/modalStyle.js";

const javascriptStyles = {
  body:{},
  ...modalStyle,
  gridLayout: {
    display: "flex",
    flexDirection: "column",
    margin: "0 15px 0",
    "& .react-grid-item": {
      boxSizing: "border-box",
      "&:hover > $boxControls" : {
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
    "& .react-grid-item:not(.react-grid-placeholder):hover": {
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
    padding: "0",
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
  previewIcon: {
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
  },
  renderBoxTitle: {
    zIndex: "-1",
    position: "absolute",
    top: "0",
    left: "43px",
    "& > h1": {
      fontSize: "1rem",
      margin: 0,
      lineHeight: "32px",
      color: "rgba(0,0,0,0.6)",
      textShadow: "0 0 2px rgb(255,255,255)"
    }
  },
  boxLazyModuleWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },
  boxControls: {
    position: "absolute",
    zIndex: 100,
    left: 0,
    top: 0,
    right: 0,
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    position: "fixed",
    right: 0,
    left: 0,
    paddingRight: 15,
    paddingLeft: 15,
    bottom: 0,
    backgroundColor: "#FFF"
  },
  bottomPaneButtons:{
    "& button": {
      marginLeft: 5
    }
  },
  bodyWrapper: {
    minHeight: "100%",
    background: "white",
    backgroundImage: `linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC),
linear-gradient(45deg, #CCC 25%, transparent 25%, transparent 75%, #CCC 75%, #CCC)`,
    backgroundSize: `10px 10px`,
    backgroundPosition: `0 0, 5px 5px`
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
  pageOptionsDetails: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    "@media screen and (max-width: 800px)": {
      flexDirection: "column"
    },
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
    margin: "0 15px"
  },
  sideMenuEditor: {
    width: "300px",
    height: "calc(100% - 60px)",
    overflowY: "auto",
  },
  optionGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  optionHolder: {
    display: "inline-block"
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
  dropZone: {

  },
  dropzoneColumn: {
    width: "50%",
    display: "inline-block",
    padding: "1rem",
    verticalAlign: "text-top",
  },
  numberPicker: {
    "& div": {
      minWidth: 100,
      margin: "5px 0"
    }
  },
  pageListModuleFields: {
    "& > div": {
      margin: "10px 0",
      "& > p": {
        display: "inline"
      }
    }
  },
  boxOptionsHeader: {
    display: "flex",
    alignItems: "center",
    "& > div": {
      marginRight: "5px"
    }
  },
  buttonsPosition: {
    display: "grid",
    gridGap: "0",
    gridTemplateColumns:"repeat(3, 1fr)",
    "& > button": {
      border: "1px solid rgba(0,0,0,0.3)",
      lineHeight: "50px",
      cursor: "pointer",
      "&.selected": {
        background: "rgba(0,0,0,0.3)",
        color: "white"
      }
    },
    "& *:nth-child(1)": {
      borderRadius: "5px 0 0"
    },
    "& *:nth-child(3)": {
      borderRadius: "0 5px 0 0"
    },
    "& *:nth-child(7)": {
      borderRadius: "0 0 0 5px"
    },
    "& *:nth-child(9)": {
      borderRadius: "0 0 5px "
    }
  }
};

export default javascriptStyles;
