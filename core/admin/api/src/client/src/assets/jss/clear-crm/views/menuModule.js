const javascriptStyles = {
  // for dropdown menu
  verticalLinksMenu: {
    display: "inline-block",
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
      },
    },
    "& ul": {
      display: "inline-block",
      margin: 0,
      padding: 0,
      listStyle: "none",
      "& li": {
        margin: 0,
        display: "block",
        position: "relative",
        background: "#525789",
        "& ul": {display: "none", margin: 0},
        "& a": {
          margin: 0,
          display: "block",
          padding: "1em",
          textDecoration: "none",
          whiteSpace: "nowrap",
          color: "#fff",
          transition: "0.3s",
          "&:hover": {
            background: "rgba(255,255,255,0.1) !important",
          },
        },
        "&:hover": {
          cursor: "pointer",
          "& > ul": {
            display: "block",
            position: "absolute",
            opacity: 0.9,
            left: "100%",
            top: 0,
          },
          "& li": {},
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
    "&.centerVertically": {
      "& ul li a": {
        display: "flex",
        alignItems: "center"
      }
    },
    "&.stretch": {
      display: "flex",
      height: "100%",
      "& > ul": {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "& li": {
          flex: 1,
          display: "flex",
          "&:hover": {
            cursor: "pointer",
            "& > ul": {
              height: "100%"
            }
          },
          "& a": {
            flex: 1
          }
        }
      }
    }
  },
  horizontalLinksMenu: {
    display: "inline-block",
    "& ul": {
      margin: 0,
      padding: 0,
      listStyle: "none",
      "& li": {
        flex: 1,
        display: "inline-block",
        height: "100%",
        "& ul": {display: "none"},
        "& a": {
          display: "flex",
          padding: "0.4em 1em",
          textDecoration: "none",
          whiteSpace: "nowrap",
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
          }
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
    "&.centerVertically": {
      "& ul li a": {
        alignItems: "center"
      },
    },
    "&.centerHorizontally": {
      "& ul li a": {
        justifyContent: "center"
      },
    },
    "&.stretch": {
      display: "flex",
      height: "100%",
      "& > ul": {
        height: "100%",
        width: "100%",
        display: "flex",
        "& li": {
          flex: 1,
          display: "block",
          "&:hover": {
            cursor: "pointer",
            "& > ul": {

            }
          },
          "& a": {
            flex: 1,
            height: "100%"
          }
        }
      }
    }
  },
};

export default javascriptStyles;
