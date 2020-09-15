//TODO import REACT and shit
import React, { Component } from "react";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";

class EditCategoryModal extends Component {
  render() {
    console.log(this.props.data);

    return (
      <form
        onSubmit={(event) => {
          this.props.onHandleInputChange(event);
          event.preventDefault();
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            this.props.onHandleInputChange(event);
          }
          event.preventDefault();
        }}
      >
        <input type="hidden" name="catId" value={this.props.data.id} />
        <CustomInput
          labelText="Name"
          id="name"
          name="name"
          required="required"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: this.props.data.name,
            type: "text",
          }}
        />
        <CustomInput
          labelText="Description"
          id="description"
          name="description"
          required="required"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            type: "text",
            value: this.props.data.description,
            multiline: true,
            rows: 5,
          }}
        />
      </form>
    );
  }
}

export default EditCategoryModal;
