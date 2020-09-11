import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/categories.js";
import Modal from "components/Modal/Modal";
import NewCategoryModal from "views/Categories/newCategoryModal";
import EditCategoryModal from "views/Categories/editCategoryModal";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";

//todo import modal content to add category

const shortid = require("shortid");

class Categories extends Component {
  state = {
    newCategoryInputtedName: "",
    newCategoryInputtedDescription: "",
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
    showNewCategoryModal: false,
    newCategoryData: {
      name: "addCategoryModal",
      title: "Add new category",
      content: (
        <NewCategoryModal
          onHandleInputChange={(event) => this.handleInputChange(event)}
        />
      ),
      closeButton: {
        callback: () => {
          this.setState({ showNewCategoryModal: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.addNewCategory();
          this.setState({ showNewCategoryModal: false });
        },
        label: "Add",
      },
    },
    showEditCategoryModal: false,
    editCategoryData: {
      name: "editCategoryModal",
      title: "Edit Category",
      content: (
        <EditCategoryModal
          onHandleInputChange={(event) => this.handleInputChange(event)}
        />
      ),
      closeButton: {
        callback: () => {
          this.setState({ showEditCategoryModal: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.doEditCategory();
          this.setState({ showEditCategoryModal: false });
        },
        label: "Save",
      },
    },
    categoryOnEditId: "",
    sortDirection: "desc",
    sortDirectionIcon: <span>&nbsp; &#x25B2; &#x25BC;</span>,
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  handleNewCategoryModal = () => {
    setTimeout(() => {
      this.setState({ showNewCategoryModal: true });
    }, 1000);
  };

  handleDelete = (categoryId) => {
    const categories = this.state.categories.filter(
      (el) => el.id !== categoryId
    );
    this.setState({ categories });
  };

  handleEditCategoryModal = (categoryId) => {
    setTimeout(() => {
      this.setState({ showEditCategoryModal: true });
      this.setState({ categoryOnEditId: categoryId });
      console.log(this.state.categoryOnEditId);
    }, 1000);
  };

  doEditCategory = () => {
    const oldStateCategories = [...this.state.categories];
    const categoriesIds = oldStateCategories.map((el) => {
      return el.id;
    });
    const rightCategoryIndex = categoriesIds.indexOf(
      this.state.categoryOnEditId
    );
    this.setState({
      ...(this.state.categories[
        rightCategoryIndex
      ].name = this.state.newCategoryInputtedName),
      ...(this.state.categories[
        rightCategoryIndex
      ].description = this.state.newCategoryInputtedDescription),
    });
  };

  handleInputChange = async (event) => {
    switch (event.target.id) {
      case "name":
        await this.setAsyncState({
          newCategoryInputtedName: event.target.value,
        });
        break;
      case "description":
        await this.setAsyncState({
          newCategoryInputtedDescription: event.target.value,
        });

        break;
    }
  };

  addNewCategory() {
    const oldState = [...this.state.categories];
    const shortid = require("shortid");

    if (
      this.state.newCategoryInputtedName &&
      this.state.newCategoryInputtedDescription
    ) {
      const newCategory = [
        {
          name: this.state.newCategoryInputtedName,
          description: this.state.newCategoryInputtedDescription,
          id: shortid.generate(),
        },
      ];
      const newCategories = oldState.concat(newCategory);
      this.setState({ categories: newCategories });
    }
  }

  handleRemoveAllCategories() {
    this.setState({ categories: "" });
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

    this.setState({ categories: newCategories });
  };

  handleSearch = (el) => {
    let categories = [...this.state.categories];
    let seekedCategory = categories.filter((categ) =>
      categ.name.includes(el.target.value)
    );
    console.log(seekedCategory);
  };

  render() {
    const classes = this.props.classes;
    const shortid = require("shortid");
    return (
      <React.Fragment>
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
            type="submit"
            color="danger"
            className={classes.button}
          >
            Remove All
          </Button>
          <br />
          <div className={classes.categoriesWrapper}>
            {this.state.categories
              ? this.state.categories.map((el) => (
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
                      onClick={() => this.handleDelete(el.id)}
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
        <button
          className={classes.newCategory}
          onClick={this.handleNewCategoryModal}
        >
          +
        </button>
        <Modal
          showModal={this.state.showNewCategoryModal}
          {...this.state.newCategoryData}
          {...this.state}
        />
        <Modal
          showModal={this.state.showEditCategoryModal}
          {...this.state.editCategoryData}
          {...this.state}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Categories);
