import modalStyle from "assets/jss/clear-crm/modalStyle.js";

const javascriptStyles = {
  buttonsWrapper: {
    width: "100%",
    display: "flex",
  },
  outerWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  ...modalStyle,
  themesWrapper: {
    width: "100%",
    display: "grid",
    gridGap: "12px",
    gridTemplateColumns: "repeat( auto-fit, minmax(200px, 1fr) )",
    margin: "12px",
  },
  column: {
    flexBasis: "49%",
  },
  modalHeadWrapper: {},
  modalHeadColumn: {
    width: "50%",
  },
  columnSeparator: {
  },
  newTbnStylesWrapper: {
    display: "flex",
    overflow: "visible",
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
  },
  pageOptionsSlider: {
  },
  previewHead: {
    textAlign: "center",
  },
  previewBodyWrapper: {
    display: "flex",
  },
  previewWrapper: {
    width: "700px",
    height: "700px",
    margin: "0 auto",
    padding: "10px",
  },
  previewList: { width: "25%" },
  previewText: {width: "75%", paddingTop: "15px", textAlign: "justify"},
  previewMenu: {
    "& span": {
      fontSize: "inherit !important",
      fontFamily: "inherit !important"
    }
  },
  media: {
    height: 205,
    margin: "5px",
    flexGrow: 1
  },
  modalBody: {
    height: "calc(100% - 125px)",
    overflow: "initial",
  },
  themeModal: {
    height: "100%",
    overflow: "initial"
  }
};

export default javascriptStyles;
