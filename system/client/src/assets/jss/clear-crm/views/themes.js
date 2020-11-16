const javascriptStyles = {
  buttonsWrapper: {
    overflow: "hidden",
    position: "absolute",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  outerWrapper: {
    overflow: "hidden",
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailsWrapper: {
    width: "50%",
    border: "11px solid pink",
    width: "50vw",
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center",
  },
  column: {
    flexBasis: "49%",
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
    padding: "10px",
  },

  previewList: { width: "25%" },

  previewText: { width: "75%", paddingTop: "15px" },

  root: {
    maxWidth: 345,
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
