import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/oldCategories.js";
import NewCategoryModal from "views/Categories/newCategoryModal";
import EditCategoryModal from "views/Categories/editCategoryModal";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";

import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Warning from "@material-ui/icons/Warning";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";

//todo import modal content to add category

const shortid = require("shortid");

class OldCategories extends Component {
  state = {
    showModal: false,
    cat_list: [],
    categories: [
      {
        name: "Categ4",
        description: "Categ4 description",
        id: shortid.generate(),
      },
      {
        name: "Categ5",
        description: "Categ5 description",
        id: shortid.generate(),
      },
      {
        name: "Categ3",
        description: "Categ3 description",
        id: shortid.generate(),
      },
      {
        name: "Categ1",
        description: "Categ1 description",
        id: shortid.generate(),
      },
      {
        name: "Categ2",
        description: "Categ2 description",
        id: shortid.generate(),
      },
    ],
    categoriesForSearchBar: [
      {
        name: "Categ4",
        description: "Categ4 description",
        id: shortid.generate(),
      },
      {
        name: "Categ5",
        description: "Categ5 description",
        id: shortid.generate(),
      },
      {
        name: "Categ3",
        description: "Categ3 description",
        id: shortid.generate(),
      },
      {
        name: "Categ1",
        description: "Categ1 description",
        id: shortid.generate(),
      },
      {
        name: "Categ2",
        description: "Categ2 description",
        id: shortid.generate(),
      },
    ],
    categoryOnEditId: "",
    sortDirection: "desc",
    sortDirectionIcon: <span>&nbsp; &#x25B2; &#x25BC;</span>,
    isBtnDisabled: true,
    repeatedCategMessage: "",
    categoryToBeRemovedId: "",
    rightCategoryIndex: "",
    modalContentType: "",
    modalTitle: "",
    modalData: {
      name: "",
      description: "",
    },
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        cat_list: this.state.categories,
      });
    }, 1000);
  }

  sendNameToEdit = () => {
    return this.state.nameToEdit;
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  handleRemoveCategory = (categoryId) => {
    this.setState({
      modalContentType: "remove",
      modalTitle: "Remove Category",
      confirmBtnText: "Proceed",
      categoryToBeRemovedId: categoryId,
    });
    setTimeout(() => {
      this.setState({ showModal: true });
    }, 1000);
  };

  removeCategory = () => {
    const categories = this.state.categories.filter(
      (el) => el.id !== this.state.categoryToBeRemovedId
    );
    this.setState({ cat_list: categories });
  };

  handleRemoveAllCategories() {
    this.setState({
      modalContentType: "removeAll",
      modalTitle: "Remove all categories",
      confirmBtnText: "Proceed",
    });
    setTimeout(() => {
      this.setState({ showModal: true });
    }, 1000);
  }

  removeAllCategories() {
    this.setState({ cat_list: "" });
  }

  handleEditCategoryModal = async (catId) => {
    this.setState({
      modalContentType: "edited",
      modalTitle: "Edit category",
      confirmBtnText: "Save",
    });

    let rightCategoryIndex = 0;
    this.state.categories.map((el, index) => {
      if (el.id === catId) {
        rightCategoryIndex = index;
      }
      return el;
    });
    let modalData = this.state.modalData;
    modalData.name = this.state.categories[rightCategoryIndex].name;
    modalData.description = this.state.categories[
      rightCategoryIndex
    ].description;
    await this.setAsyncState({
      rightCategoryIndex,
      modalData,
    });
    this.setState({ showModal: true });
  };

  doEditCategory = async () => {
    let categories = this.state.categories;
    categories[this.state.rightCategoryIndex] = this.state.modalData;
    await this.setAsyncState({
      categories: categories,
    });
    await this.setAsyncState({
      cat_list: categories,
    });
  };

  handleInputChange = async (event) => {
    if (this.state.modalContentType === "added") {
      let modalData = this.state.modalData;
      modalData[event.target.id] = event.target.value;
      await this.setAsyncState({
        modalData: modalData,
        isBtnDisabled: event.target.value.length >= 5 ? false : true,
      });
    }
    if (this.state.modalContentType === "edited") {
      let modalData = this.state.modalData;
      modalData[event.target.id] = event.target.value;
      await this.setAsyncState({
        modalData: modalData,
        isBtnDisabled: event.target.value.length >= 5 ? false : true,
      });
    }
  };

  handleNewCategoryModal = async () => {
    await this.setAsyncState({
      modalContentType: "added",
      modalTitle: "Add new category",
      confirmBtnText: "Add",
    });
    await this.setAsyncState({
      modalData: { name: "", description: "" },
    });
    this.setState({ showModal: true });
  };

  addNewCategory() {
    const oldState = [...this.state.cat_list];
    const shortid = require("shortid");

    if (
      this.state.cat_list.find(
        (el) =>
          el.name.toLowerCase() === this.state.modalData.name.toLowerCase()
      )
    ) {
      this.setState({
        repeatedCategMessage: (
          <Snackbar
            open
            place="tc"
            color="danger"
            icon={Warning}
            message="Category already exists"
          />
        ),
      });
      setTimeout(() => {
        this.setState({ repeatedCategMessage: "" });
      }, 2000);
    } else {
      this.setState({ repeatedCategMessage: "" });
      const newCategory = [
        {
          name: this.state.modalData.name,
          description: this.state.modalData.description,
          id: shortid.generate(),
        },
      ];
      const newCategories = oldState.concat(newCategory);
      this.setState({ cat_list: newCategories });
    }
  }

  handleSortByName = () => {
    const categories = [...this.state.categories];
    let newCategories;
    if (this.state.sortDirection === "desc") {
      newCategories = categories.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
      });
      this.setState({
        sortDirection: "asc",
        sortDirectionIcon: <span>&nbsp; &#x25B2;</span>,
      });
    } else {
      newCategories = categories.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
      });
      this.setState({
        sortDirection: "desc",
        sortDirectionIcon: <span>&nbsp; &#x25BC;</span>,
      });
    }

    this.setState({ cat_list: newCategories });
  };

  handleSearch = (el) => {
    let categories = [...this.state.categories];
    let seekedCategories = categories.filter((categ) =>
      categ.name.toLowerCase().includes(el.target.value.toLowerCase())
    );
    this.setState({ cat_list: seekedCategories });
  };

  setModalContent = () => {
    const modalContentType = this.state.modalContentType;
    if (modalContentType === "added" || modalContentType === "edited") {
      return (
        <form>
          <CustomInput
            labelText="Name"
            id="name"
            name="name"
            required="required"
            formControlProps={{
              onChange: (event) => this.handleInputChange(event),
              fullWidth: true,
            }}
            inputProps={{
              value: this.state.modalData.name,
              type: "text",
            }}
          />
          <CustomInput
            labelText="Description"
            id="description"
            name="description"
            required="required"
            formControlProps={{
              onChange: (event) => this.handleInputChange(event),
              fullWidth: true,
            }}
            inputProps={{
              value: this.state.modalData.description,
              type: "text",
              multiline: true,
              rows: 5,
            }}
          />
        </form>
      );
    }
    if (modalContentType === "remove" || modalContentType === "removeAll") {
      return <div>Are you sure you want to proceed ?</div>;
    }
  };

  closeModal() {
    this.setState({ showModal: false });
  }

  callConfirmCallback = () => {
    const modalContentType = this.state.modalContentType;
    if (modalContentType === "added") {
      this.addNewCategory();
      this.closeModal();
    }
    if (modalContentType === "edited") {
      this.doEditCategory();
      this.closeModal();
    }
    if (modalContentType === "remove") {
      this.removeCategory();
      this.closeModal();
    }
    if (modalContentType === "removeAll") {
      this.removeAllCategories();
      this.closeModal();
    }
  };

  render() {
    const classes = this.props.classes;
    const shortid = require("shortid");

    return (
      <React.Fragment>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={this.state.showModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.closeModal()}
            >
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            {this.setModalContent()}
          </DialogContent>

          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="transparent"
              simple
              onClick={() => {
                this.callConfirmCallback();
              }}
            >
              {this.state.confirmBtnText}
            </Button>
            <Button
              color="danger"
              simple
              onClick={() => {
                this.closeModal();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {this.state.repeatedCategMessage}
        <div className={classes.categoriesPanel}>
          <h2>Categories</h2>
          <br />

          <CardBody>
            <CustomInput
              labelText="Search for a specific category..."
              id="searchBox"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                onChange: (event) => this.handleSearch(event),
              }}
            />
          </CardBody>

          <Button
            onClick={() => this.handleSortByName()}
            type="submit"
            color="success"
            className={classes.button}
          >
            Sort by Name
            {this.state.sortDirectionIcon}
          </Button>

          <Button
            onClick={() => this.handleRemoveAllCategories()}
            name="removeAllCategories"
            type="submit"
            color="danger"
            className={classes.button}
          >
            Remove All
          </Button>
          <br />
          <div className={classes.categoriesWrapper}>
            {this.state.cat_list
              ? this.state.cat_list.map((el) => (
                  <div
                    key={shortid.generate()}
                    className={classes.categoryWrapper}
                  >
                    <p>{el.name}</p>
                    <hr />
                    <p>{el.description}</p>
                    <Button
                      onClick={() => this.handleEditCategoryModal(el.id)}
                      type="submit"
                      color="primary"
                      size="sm"
                      className={classes.button}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => this.handleRemoveCategory(el.id)}
                      type="submit"
                      color="danger"
                      size="sm"
                      className={classes.button}
                    >
                      X
                    </Button>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <Button
          className={classes.button + " " + classes.newCategory}
          size="sm"
          type="submit"
          color="primary"
          onClick={this.handleNewCategoryModal}
        >
          +
        </Button>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(OldCategories);
