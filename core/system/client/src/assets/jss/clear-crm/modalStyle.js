const modalStyle = {
  smallModal: {
    width: "420px",
  },
  normalModal: {
    width: "70vw",
    height: "60vh",
    margin: "16px"
  },
  largeModal: {
    width: "90vw",
    height: "calc(100vh - 60px)",
    margin: "10px"
  },
  modal: {
    maxWidth: "100vw",
    maxHeight: "100vh",
    "&$modalResize": {
      borderRadius: "6px 6px 0 6px",
    }
  },
  modalResize: {
    resize: "both"
  },
  modalHeader: {
    borderBottom: "none",
    padding: "10px",
    minHeight: "16.43px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  modalTitle: {
    margin: "0",
    lineHeight: "1.42857143"
  },
  modalCloseButton: {
    padding: "0",
    cursor: "pointer",
    background: "0 0",
    border: "0",
    fontSize: "inherit",
    opacity: ".9",
    textShadow: "none",
    fontWeight: "700",
    lineHeight: "1"
  },
  modalBody: {
    padding: "0",
    position: "relative"
  },
  modalFooter: {
    padding: "0 23px 0 5px",
    textAlign: "right",
    paddingTop: "0",
    margin: "0",

  },
  modalFooterCenter: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  modalPageOptions: {
    borderRadius: "6px",
    maxWidth: "100vw",
    height: "100vh",
    margin: "5px"
  },
  modalBodyPageOptions:{

  }
};

export default modalStyle;
