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
  // for dropdown menu
  verticalLinksMenu: {
    "& > ul": {
      display: "inline-block",
      padding: 0,
      margin: 0,
      "& > li": {
        margin: 0,
        display: "block",
        position: "relative",
        left: 0,
        background: "#525789",
        fontFamily: "cambria",
        transform: "translate(0%)",
      },
    },
    "& > ul ul": {
      width: "100%",
    },
    "& ul": {
      display: "inline-block",
      margin: 0,
      listStyle: "none",
      "& li": {
        margin: 0,

        display: "block",
        position: "relative",
        right: 0,
        transform: "translate(100%, -50px)",
        background: "#525789",
        fontFamily: "cambria",
        "& ul": { display: "none", margin: 0 },
        "& a": {
          margin: 0,
          display: "block",
          padding: "1em",
          textDecoration: "none",
          whiteSpace: "normal",
          color: "#fff",
          transition: "0.3s",
          "&:hover": {
            background: "#8497AF",
          },
        },
        "&:hover": {
          cursor: "pointer",
          "& > ul": {
            display: "block",
            position: "absolute",
            opacity: 0.9,
            right: 0,
          },
          "& li": {
            float: "none",
          },
          "& a": {
            background: "#41424c",
          },
        },
      },
      "&:before": {
        content: " ",
        display: "table",
      },

      "&:after": {
        content: " ",
        display: "table",
        clear: "both",
      },
    },
  },
  horizontalLinksMenu: {
    "& ul": {
      margin: 0,
      padding: 0,
      listStyle: "none",
      "& li": {
        flex: 1,
        display: "inline-block",
        fontFamily: "cambria",
        "& ul": { display: "none" },
        "& a": {
          display: "block",
          padding: "0.4em 1em",
          textDecoration: "none",
          whiteSpace: "normal",
          width: "100%",
          transition: "0.3s",
          "&:hover": {
            background: "#8497AF",
          },
        },
        "&:hover": {
          cursor: "pointer",
          "& > ul": {
            flex: 1,
            display: "inline-block",
            position: "absolute",
            opacity: 0.9,
          },
          "& li": {
            display: "block",
          },
          "& a": {
            display: "block",
          },
        },
      },
      "&:before": {
        content: " ",
        display: "table",
      },

      "&:after": {
        content: " ",
        display: "table",
        clear: "both",
      },
      "& ul": {
        "& ul": {
          left: "100%",
          top: "0",
        },
      },
    },
  },
};

export default javascriptStyles;
