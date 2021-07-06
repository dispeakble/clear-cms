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

  root: {
    '@media (min-width: 240px)': {
      flex: "1 0 50%"
    },
    '@media (min-width: 1024px)': {
      flex: "1 0 25%"
    },
    margin:"0 5px 5px 0"
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
  modal: {
    height: "100%",
    overflow: "initial",
  },
};

export default javascriptStyles;
