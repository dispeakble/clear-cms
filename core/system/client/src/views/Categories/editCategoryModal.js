//TODO import REACT and shit
import React, { Component } from "react";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";

class EditCategoryModal extends Component {
  render() {
    return (
      <form>
        <CustomInput
          labelText="Name"
          id="name"
          required="required"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            type: "text",
            onChange: (event) => this.props.onHandleInputChange(event),
          }}
        />
        <CustomInput
          labelText="Description"
          id="description"
          required="required"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            type: "text",
            multiline: true,
            rows: 5,
            onChange: (event) => this.props.onHandleInputChange(event),
          }}
        />
      </form>
    );
  }
}

export default EditCategoryModal;
