import { defaultFont } from "assets/jss/clear-crm.js";

import tooltip from "assets/jss/clear-crm/tooltipsStyle.js";

const headerLinksStyle = (theme) => ({
  list: {
    ...defaultFont,
    fontSize: "14px",
    margin: 0,
    paddingLeft: "0",
    listStyle: "none",
    paddingTop: "0",
    paddingBottom: "0",
    color: "inherit",
  },
  linksContainer: {
    position: "relative",
    height: "100%",
  },
  listItem: {
    color: "inherit",
    position: "relative",
    display: "block",
    width: "auto",
    margin: "0",
    padding: "0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      "&:after": {
        width: "calc(100% - 30px)",
        content: '""',
        display: "block",
        height: "1px",
        marginLeft: "15px",
        backgroundColor: "#e5e5e5",
      },
    },
  },
  listItemText: {
    padding: "0 !important",
    color: "rgba(0,0,0,.87)",
  },
  accordionLinks: {
    width: "100%",
    padding: "0",
    // "& :hover": {
    //   backgroundColor: "#006C6C",
    // },
  },
  accordionLinksItem: {
    "&:hover :nth-child(1)": { color: "white" },
  },
  accordion: {
    padding: "0",
    width: "100%",
  },
  links: {
    color: "black",
    "&:visited": {
      color: "black",
    },
  },
  navLink: {
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    borderRadius: "3px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "block",
    width: "100%",
    "&:hover,&:focus": {
      color: "inherit",
      background: "rgba(200, 200, 200, 0.2)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start",
      },
    },
  },
  logOut: {
    color: "inherit",
    background: "rgba(255,0,0,0.1)",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    borderRadius: "3px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "block",
    position: "absolute",
    bottom: "20px",
    width: "100%",
    "&:hover,&:focus": {
      color: "white",
      background: "rgba(255, 0, 0, 1)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start",
      },
    },
  },
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "100%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  // menuCategory: {
  //   "&:hover": {
  //     backgroundColor: "#006C6C",
  //   },
  //   "&:hover :nth-child(1)": {
  //     color: "white",
  //   },
  // },
  notificationNavLink: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    top: "4px",
  },
  registerNavLink: {
    top: "3px",
    position: "relative",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
  },
  navLinkActive: {
    color: "inherit",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  icons: {
    width: "20px",
    height: "20px",
    marginRight: "3px",
  },
  socialIcons: {
    position: "relative",
    fontSize: "20px !important",
    marginRight: "4px",
  },
  dropdownLink: {
    color: "inherit",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    background: "inherit",
    textDecoration: "none",
    display: "block",
    padding: "10px 20px",
    width: "100%",
    "&:hover,&:focus": {
      background: "rgba(0,0,0,.1)",
    },
  },
  ...tooltip,
  marginRight5: {
    marginRight: "5px",
  },
});

export default headerLinksStyle;
