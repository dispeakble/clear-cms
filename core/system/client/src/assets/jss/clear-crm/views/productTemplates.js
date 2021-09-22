import modalStyle from "assets/jss/clear-crm/modalStyle.js";

const styles = {
    ...modalStyle,
    panel: {
        marginTop: 60,
        textAlign: "center"
    },
    ecommerceTemplatesDropdowns: {
        "& > div": {
            margin: "10px 0",
            maxWidth: 300
        }
    },
    actions: {
        textAlign: "initial"
    }
};

export default  styles