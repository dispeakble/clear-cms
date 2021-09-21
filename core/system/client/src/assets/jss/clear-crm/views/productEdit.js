import modalStyle from "assets/jss/clear-crm/modalStyle.js";

const styles = {
    ...modalStyle,
    rightSideIcon: {
        fontSize: "2rem",
    },
    productTitleInputWrapper: {
        padding: "0",
        display: "flex",
        justifyContent: "space-between",
        "& > :not(:last-child)" : {
            paddingRight: "15px"
        }
    },
    productOptionsDetails: {
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        "@media screen and (max-width: 800px)": {
            flexDirection: "column"
        },
        "& > div": {
            flexGrow: 1,
            margin: "0 5px"
        },
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
    option: {
        width: "100%",
        marginBottom: "15px",
        fontSize: 15,
        "& > span": {
            marginRight: 10,
            fontSize: 18,
        },
    },
    textfield: {
        fontSize: "10rem",
        color: "gold",
    },
    bottomPane:{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        position: "fixed",
        right: 0,
        left: 0,
        paddingRight: 15,
        paddingLeft: 15,
        bottom: 0,
        backgroundColor: "#FFF"
    },
    bottomPaneButtons:{
        "& button": {
            marginLeft: 5
        }
    },
    tabsMenu: {
        marginBottom: 10
    },
    autocompleteDropdown: {
        maxWidth: 250
    },
    secondColumn: {
        paddingTop: 25
    },
    "@media screen and (max-width: 800px)": {
        autocompleteDropdown: {
            maxWidth: "none",
            width: "100%",
            margin: "10px 0"
        }
    },
}

export default styles;