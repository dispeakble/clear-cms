const categories = {
  categoriesPanel: {
    textAlign: "center",
    marginTop: "30vh",
  },
  categoriesWrapper: {
    margin: "0 auto",
    width: "80%",
    height: "auto",
    minWidth: "10rem",
  },
  categoryWrapper: {
    display: "inlineBlock",
    float: "left",
    width: "20%",
    backgroundColor: "white",
    padding: "10px",
    border: "1px solid transparent",
    borderRadius: "20px",
    margin: "10px",
  },
  newCategory: {
    padding: "20px",
    fontSize: "2rem",
    border: "1px solid transparent",
    borderRadius: "50px",
    backgroundColor: "darkcyan",
    cursor: "pointer",
    color: "white",
    position: "absolute",
    right: "10vw",
    bottom: "20vh",
    "&:hover": {
      backgroundColor: "white",
      color: "darkcyan",
    },
  },
  removeButton: {
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    border: "1px solid transparent",
    borderRadius: "9px",
    cursor: "pointer",
  },
};

export default categories;
