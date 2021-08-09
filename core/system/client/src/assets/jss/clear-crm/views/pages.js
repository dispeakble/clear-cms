/*import { container, title } from "assets/jss/clear-crm.js";

import modalStyle from "assets/jss/clear-crm/modalStyle.js";
import tooltipsStyle from "assets/jss/clear-crm/tooltipsStyle.js";
import popoverStyles from "assets/jss/clear-crm/popoverStyles.js";
import { GpsFixed } from "@material-ui/icons";*/

const javascriptStyles = {
  pagesPanel: {
    textAlign: "center",
    marginTop: "60px",
  },
  pagesWrapper: {
    margin: "0 auto",
    width: "80%",
    height: "auto",
    minWidth: "10rem",
    "@media (max-width: 500px)" : {
      width: "100%",
    }
  },
  tableCells: {
    fontSize: "90%",
  },
  tableActions: {
    width: 40,
  },
  tableHeader: {
    backgroundColor: "#B2ACAB",
    color: "white",
    fontSize: "100%",
  },
  speedDialIcon: {
    cursor: "pointer",
    width: "55px",
    height: "55px",
    paddingTop: "15px",
    textAlign: "center",
    backgroundColor: "#008B8B",
    color: "white",
    border: "1px solid tranparent",
    borderRadius: "20rem",
    position: "fixed",
    bottom: "1rem",
    right: "1.5rem",
    "&:hover": {
      backgroundColor: "#006F6F",
    },
  },
};

export default javascriptStyles;
