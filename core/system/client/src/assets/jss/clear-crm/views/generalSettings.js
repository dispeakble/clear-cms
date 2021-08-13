import { container } from "assets/jss/clear-crm.js";

import imagesStyle from "assets/jss/clear-crm/imagesStyles.js";

const generalSettingsPageStyle = {
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
    grid: {
        margin: 0
    },
    gridItem: {
        padding: 0
    },
    column: {
        width: "50%",
    },
    button: {
        cursor: "pointer",
    },
};

export default generalSettingsPageStyle;
