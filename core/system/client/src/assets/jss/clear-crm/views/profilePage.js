import {container, title} from "assets/jss/clear-crm.js";

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
        "@media (max-width: 400px)":{
            "& .MuiInputAdornment-root":{
                display:"none"
            }
        }
    },
    description: {
        margin: "1.071rem auto 0",
        maxWidth: "600px",
        color: "#999",
        textAlign: "center !important",
    },
    name: {},
    ...imagesStyle,
    main: {
        position: "relative",
        zIndex: "3",
    },
    mainRaised: {
        margin: "60px 10px 0px",
        borderRadius: "6px",
        boxShadow:
            "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    },
    grid: {
        margin: 0
    },
    gridItem: {
        padding: 0
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
        paddingBottom: "10px",
        margin: "0 auto",
        "& button": {
            padding: 0,
            margin: "0 3px"
        },
        "& button:nth-child(1):hover": {
            color: "#1DA1F3",
        },
        "& button:nth-child(2):hover": {
            color: "#4267B2",
        },
        "& button:nth-child(3):hover": {
            color: "#EA4335",
        },
    },
    column: {
        width: "50%",
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
    button: {
        cursor: "pointer",
    },
    syncAccountText: {
        textAlign: "left",
        display: "inline-block",
        minWidth: "35%",
    },
};

export default profilePageStyle;
