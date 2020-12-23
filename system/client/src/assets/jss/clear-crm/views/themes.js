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
  themesWrapper: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
  },
  column: {
    flexBasis: "49%",
  },
  modalHeadWrapper: {},
  modalHeadColumn: {
    width: "50%",
  },
  columnSeparator: {
    borderRight: "1px solid darkcyan",
    paddingRight: "1%",
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
    width: "90%",
    margin: "0 auto",
  },
  pageOptionsSlider: {
    width: "80%",
    marginLeft: "10%",
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

  previewText: { width: "75%", paddingTop: "15px" },

  root: {
    maxWidth: "345px",
    padding: "5px",
  },
  media: {
    height: 140,
  },
  modalBody: {
    height: "calc(100% - 125px)",
    overflow: "initial",
  },
  modal: {
    height: "100%",
    overflow: "initial",
  },
};

export default javascriptStyles;
