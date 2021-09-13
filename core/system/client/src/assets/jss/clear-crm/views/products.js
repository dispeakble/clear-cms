import modalStyle from "assets/jss/clear-crm/modalStyle.js";

const styles = {
    ...modalStyle,
    panel: {
        marginTop: 60,
        textAlign: "center"
    },
    wrapper: {
        margin: "0 auto",
        width: "80%",
        height: "auto",
        minWidth: "10rem",
        "@media (max-width: 500px)" : {
            width: "100%",
        }
    },
    tableHeader: {
        backgroundColor: "#B2ACAB",
        color: "white",
        fontSize: "100%",
    },
    tableCells: {
        fontSize: "90%",
    }
};

export default  styles