import _ from "lodash";
import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import { Link } from "react-router-dom";
import {
  Save,
  Delete,
  DeleteForever,
  AddCircle,
  Code,
  Visibility,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import CustomInput from "components/CustomInput/CustomInput.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";

// for Hamburger Menu
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

// for the dropdown inside each field
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PagesAdd extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    //colsClient: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },//PUT THIS ON PRODUCTION AND PREVIEW
    cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
    rowHeight: 100,
  };

  state = {
    title: "",
    showModal: false,
    itemOnDeleteIndex: "",
    isAddBtnDisabled: true,
    items: [0, 1, 2, 3, 4].map(function (i, key, list) {
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2,
        add: i === list.length - 1,
      };
    }),
    newCounter: 0,
    actions: [
      { icon: <Save onClick={() => this.handleSave()} />, name: "Save block" },
      {
        icon: <Delete onClick={() => this.handleDelete()} />,
        name: "Remove block",
      },
      {
        icon: <AddCircle onClick={() => this.onAddItem()} />,
        name: "Add block",
      },
      {
        icon: <Code />,
        name: "Split View",
      },
      {
        icon: (
          <Link className={this.props.classes.links} to="/pagePreview">
            <Visibility className={this.props.classes.previewIcon} />
          </Link>
        ),
        name: "Preview",
      },
    ],
    open: false,
    hidden: false,
  };

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
    const i = el.i;
    return (
      <div key={i} data-grid={el}>
        <span className="text">
          <CustomInput
            labelText="Title"
            id="fieldTitle"
            required="required"
            formControlProps={{
              fullWidth: true,
              onChange: (event) => this.handleInputChange(event),
            }}
            inputProps={{
              value: this.state.name,
              type: "text",
            }}
          />
        </span>
        <span
          className={this.props.classes.removeItemIcon}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          <IconButton color="secondary" iconStyle={{ width: 30, height: 30 }}>
            <DeleteForever />
          </IconButton>
        </span>
      </div>
    );
  }

  onAddItem = () => {
    /*eslint no-console: 0*/
    console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: Math.random().toFixed(2),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
    });
  };

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  };

  onLayoutChange(layout) {
    this.setState({ layout: layout });
  }

  onRemoveItem(i) {
    this.setState({
      items: _.reject(this.state.items, { i: i }),
    });
  }

  handleInputChange = (event) => {
    if (event.target.value.length >= 5) {
      this.setState({ isAddBtnDisabled: false, title: event.target.value });
    } else {
      this.setState({ isAddBtnDisabled: true });
    }
  };

  closeModal() {
    this.setState({ showModal: false });
  }

  handleEdit = () => {
    console.log("editted");
  };

  handleSave = () => {
    const { history } = this.props;
    history.push("/pages");
  };

  handleDelete = () => {
    this.setState({ showModal: true });
  };

  callConfirmCallback = () => {
    this.closeModal();
    const { history } = this.props;
    history.push("/pages");
  };

  // for Hamburger menu

  handleHiddenChange = (event) => {
    this.setState({ hidden: event.target.checked });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  // for MuiThemeProvider

  getTheme = () => {
    /*
    error?: PaletteColorOptions;
  warning?: PaletteColorOptions;
  info?: PaletteColorOptions;
  success?: PaletteColorOptions;
    */
    return createMuiTheme({
      overrides: {
        MuiSpeedDial: {
          fab: {
            backgroundColor: "darkcyan",
            "&:hover": {
              backgroundColor: "#006F6F",
            },
          },
        },
        MuiFormControl: {
          root: {
            backgroundColor: "white",
          },
        },
      },
    });
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <MuiThemeProvider theme={this.getTheme()}>
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
              <div>Are you sure you want to proceed ?</div>
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
                <div>Proceed</div>
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
          <div className={classes.gridLayout}>
            <div className={classes.pageTitle}>
              <CustomInput
                labelText="Title"
                id="title"
                required="required"
                formControlProps={{
                  fullWidth: true,
                  onChange: (event) => this.handleInputChange(event),
                }}
                inputProps={{
                  value: this.state.name,
                  type: "text",
                }}
              />
            </div>

            <ResponsiveReactGridLayout
              isBounded="true"
              onLayoutChange={() => this.onLayoutChange}
              onBreakpointChange={() => this.onBreakpointChange}
              {...this.props}
            >
              {_.map(this.state.items, (el) => this.createElement(el))}
            </ResponsiveReactGridLayout>
          </div>
          <div className={classes.actionsButtons}></div>
          <div className={classes.root}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.hidden}
                  onChange={this.handleHiddenChange}
                  color="primary"
                />
              }
              label="Hidden"
            />
            <div className={classes.exampleWrapper}>
              <SpeedDial
                ariaLabel="SpeedDial example"
                className={classes.speedDial}
                hidden={this.state.hidden}
                icon={<SpeedDialIcon />}
                onClose={this.handleClose}
                onOpen={this.handleOpen}
                open={this.state.open}
              >
                {this.state.actions.map((action) => (
                  <SpeedDialAction
                    className={classes.speedDialAction}
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={this.handleClose}
                  />
                ))}
              </SpeedDial>
            </div>
          </div>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagesAdd);
