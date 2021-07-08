import React, { Component } from "react";
import Chart from "react-google-charts";

import ArtTrack from "@material-ui/icons/ArtTrack";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Typography from "@material-ui/core/Typography";
import CustomInput from "components/CustomInput/CustomInput.js";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "components/CustomButtons/Button.js";

import { DropzoneArea } from "material-ui-dropzone";

class ChartModule extends Component {
  state = {
    chartTypes: [
      { label: "Area" },
      { label: "Bar" },
      { label: "Bubble" },
      { label: "Calendar" },
      { label: "Candlestick" },
      { label: "Column" },
      { label: "Diff Scatter" },
      { label: "Diff Column" },
      { label: "Donut" },
      { label: "Gantt" },
      { label: "Gauge" },
      { label: "Geo" },
      { label: "Histogram" },
      { label: "Line" },
      { label: "Material Bar" },
      { label: "Material Line" },
      { label: "Org" },
      { label: "Pie" },
      { label: "Sankey" },
      { label: "Scatter" },
      { label: "Stepped Area" },
      { label: "Table" },
      { label: "Timeline" },
      { label: "Treemap" },
      { label: "Waterfall" },
      { label: "Wordtree" },
    ],
    chartType: "",
    bgImage: "",
    columns: [
      {
        type: "number",
        label: "year",
      },
      {
        label: "AttentionSpan",
        type: "number",
      },
    ],
    rows: [],
    enableChart: true,
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "chartTitle":
        let chartTitle = this.state.chartTitle;
        chartTitle = event.target.value + "";
        console.log(event.target.value);
        this.setState({ chartTitle });
        break;
      default:
        break;
    }
  };

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  toStr(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleUploadedFile = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toStr(file)));

      console.log(strings[0]);

      this.setAsyncState({
        rows: JSON.parse(strings[0]),
        enableChart: false,
      });

      setTimeout(() => {
        this.setState({ enableChart: true });
      }, 30);
    }
  };

  render() {
    return (
      <React.Fragment>
        {" "}
        <Tooltip title="Chart Module">
          <IconButton
            onClick={() => this.handleEdit(this.props.boxId)}
            color="primary"
            size="medium"
          >
            <ArtTrack />
          </IconButton>
        </Tooltip>{" "}
        <Dialog
          fullWidth={true}
          style={{ width: "40%", margin: "0 auto" }}
          maxWidth={"md"}
          onBackdropClick={() => "false"}
          open={this.state.showModuleOptionsModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeModuleOptionsModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            style={{
              textAlign: "center",
            }}
            id="classic-modal-slide-title"
            disableTypography
          >
            <h4>Edit Chart Module</h4>
          </DialogTitle>
          <DialogContent id="classic-modal-slide-description">
            <CustomInput
              labelText="Title"
              id="chartTitle"
              required="required"
              formControlProps={{
                fullWidth: true,
                onChange: (event) => this.handleInputChange(event),
              }}
              inputProps={{
                value: this.state.bannerTitle,
                type: "text",
              }}
            />
            <Autocomplete
              style={{ margin: "5% 0" }}
              id="moduleDropdown"
              onChange={this.handleChartType}
              autoHighlight
              getOptionLabel={(option) => option.label}
              defaultValue={this.state.chartTypes[this.state.chartType]}
              options={this.state.chartTypes}
              renderInput={(params) => (
                <TextField {...params} label="Type" variant="outlined" />
              )}
            />{" "}
            <Typography id="discrete-slider" gutterBottom>
              Data File Upload(only JSON format accepted)
              <DropzoneArea
                clearOnUnmount={true}
                acceptedFiles={["application/json"]}
                filesLimit={1}
                onChange={this.handleUploadedFile.bind(this)}
              />
            </Typography>
            <div style={{ height: "400px" }}>
              {this.state.enableChart ? (
                <Chart
                  chartType="AreaChart"
                  width="100%"
                  height="400px"
                  legendToggle
                  rows={this.state.rows}
                  columns={this.state.columns}
                />
              ) : (
                ""
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.handleSave(this.state.itemModuleEditId);
                this.closeModuleOptionsModal();
              }}
            >
              <div>Save</div>
            </Button>
            <Button
              color="danger"
              onClick={() => {
                this.closeModuleOptionsModal();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default ChartModule;
