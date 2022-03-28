import { container } from "assets/jss/clear-crm.js";
import bgImage from "../../../img/view-auth-bg.jpg";

const signupPageStyle = {
  container: {
    ...container,
    zIndex: "2",
    position: "relative",
    paddingTop: "20vh",
    color: "#FFFFFF",
    paddingBottom: "200px",
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)",
  },
  pageHeader: {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    height: "auto",
    display: "inherit",
    position: "relative",
    margin: "0",
    padding: "0",
    border: "0",
    alignItems: "center",
    "&:before": {
      background: "rgba(0, 0, 0, 0.5)",
    },
    "&:before,&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: '""',
    },
    "& footer li a,& footer li a:hover,& footer li a:active": {
      color: "#FFFFFF",
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%",
    },
  },
  form: {
    margin: "0",
  },
  cardHeader: {
    width: "auto",
    textAlign: "center",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "-40px",
    padding: "20px 0",
    marginBottom: "15px",
  },
  socialIcons: {
    maxWidth: "24px",
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    textAlign: "center",
  },
  cardFooter: {
    paddingTop: "0rem",
    border: "0",
    borderRadius: "6px",
    justifyContent: "center !important",
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputIconsColor: {
    color: "#495057",
  },
  recoverPassword: {
    cursor: "pointer",
    color: "darkcyan",
    "&:hover": {
      color: "darkcyan",
    },
  },
  passwordField: {
    display: "block",
  },
  hidden: {
    display: "none",
  },
  errorMessage: {
    position: "fixed",
    top: "0",
    left: "33%",
    width: "30%",
    color: "white",
    fontSize: "2rem",
    border: "1px solid white",
    padding: "30px",
    background: "green",
  },
  passwordStrength:{
    display:"inline-block",
    width:"24px",
    height:"24px",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    background: "conic-gradient(grey 0 25%, grey 25% 50%, grey 50% 75%, grey 75% 100%)",
    borderRadius: "50%"
  },
  passwordBar: {
    display: "inline-block",
    width: "calc(20% - 5px)",
    height: "5px",
    lineHeight: "13px",
    border: "1px solid transparent",
    borderRadius: "9px",
    margin: "0 5px 0 0",
    alignItems: "center",
  },
  passwordText: {
    fontSize: "80%",
    width: "calc(20% - 5px)",
    margin: "0 5px 0 0",
    whiteSpace: "nowrap",
    textAlign: "left"
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
};

export default signupPageStyle;
