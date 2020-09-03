import { container, title } from "assets/jss/clear-crm.js";

import imagesStyle from "assets/jss/clear-crm/imagesStyles.js";

const profilePageStyle = {
  container,
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)",
    },
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: "#999",
    textAlign: "center !important",
  },
  name: {
    marginTop: "-80px",
  },
  ...imagesStyle,
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3",
  },
  mainRaised: {
    margin: "60px 10px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999",
  },
  navWrapper: {
    margin: "20px auto 50px auto",
    textAlign: "center",
  },
  syncToAccount: {
    border: "2px solid #B4B4B4",
    transition: "all 0.5s",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "white",
      boxShadow: "inset 0 0 3px #000000",
    },
  },
  syncToAccountWrapper: {
    "& div:nth-child(1):hover": {
      border: "2px solid #EA4335",
    },
    "& div:nth-child(3):hover": {
      border: "2px solid #1DA1F3",
    },
    "& div:nth-child(5):hover": {
      border: "2px solid #9231BF",
    },
    "& div:nth-child(7):hover": {
      border: "2px solid #4267B2",
    },
  },
  passwordBar: {
    display: "inline-block",
    float: "left",
    width: "23%",
    height: "5px",
    backgroundColor: "#B4B4B4",
    border: "1px solid transparent",
    borderRadius: "9px",
    marginRight: "5px",
  },
  passwordText: {
    display: "inline-block",
    float: "left",
    fontSize: "80%",
  },
  weak: {
    backgroundColor: "red",
  },
  none: {
    backgroundColor: "#B4B4B4",
  },
  medium: {
    backgroundColor: "gold",
  },
  strong: {
    backgroundColor: "#98FB98",
  },
  veryStrong: {
    backgroundColor: "darkcyan",
  },
  button: {
    marginTop: "10%",
  },
};

export default profilePageStyle;
