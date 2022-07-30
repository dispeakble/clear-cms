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
    colorPickerContainer: {
        width: "100%",
        padding: "20px",
        cursor: "pointer",
        borderRadius: "6px",
        boxShadow:
            "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        position: "relative",
        maxHeight:"64px",
    },
    hexFormGroup: {
        display: 'flex',
        gap: '4px',
    },
    colorPickerOverlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '999',
        background: 'transparent',
        cursor: 'pointer'
    },
    accordionColorItems: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
    },
    actionButtonsContainer: {
        display: "flex",
        gap: "8px"
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
    heading: {
        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        color: "white"
    }
};

export default generalSettingsPageStyle;
