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
  Edit,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import CustomInput from "components/CustomInput/CustomInput.js";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

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

// for the styling side-menu
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CustomDropdown from "components/CustomDropdown/CustomDropdown";
import Drawer from "@material-ui/core/Drawer";
import ColorPicker from "material-ui-color-picker";

// for accordeon
import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import { DropzoneArea } from "material-ui-dropzone";

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
    items: [
      {
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1px",
        borderRadius: "5px",
        backgroundImage: "",
        title: "Header",
        module: "Header Module",
        i: 0,
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        add: false,
      },
      {
        backgroundColor: "grey",
        borderColor: "grey",
        borderWidth: "0",
        borderRadius: "0",
        backgroundImage: "",
        title: "Menu",
        module: "Menu Module",
        i: "1",
        x: 0,
        y: 2,
        w: 2,
        h: 12,
        add: false,
      },
      {
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: "0",
        borderRadius: "0",
        backgroundImage: "",
        title: "Home Page",
        module: "Text Module",
        i: "2",
        x: 3,
        y: 2,
        w: 10,
        h: 12,
        add: false,
      },
    ],
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
    itemsDetails: [
      [{ label: "Header1" }, { label: "Menu1" }, { label: "Text1" }],
      [{ label: "Header2" }, { label: "Menu2" }, { label: "Text2" }],
      [{ label: "Header3" }, { label: "Menu3" }, { label: "Text3" }],
      [{ label: "Header4" }, { label: "Menu4" }, { label: "Text4" }],
      [{ label: "Header5" }, { label: "Menu5" }, { label: "Text5" }],
    ],
    config: {
      layoutBoxSpacing: [10, 10],
    },
    showEditMenu: false,
    itemOnEditIndex: "",
    itemBgColor: "",
    changedBgColor: "",
    itemBorderColor: "",
    changedBgColor: "",
    itemBorderWidth: "",
    changedBorderWidth: "",
    itemBorderRadius: "",
    changedBorderRadius: "",
    itemImgSrc: "",
    changedImgSrc: "",
    bgColor: "",
    bgImage: "",
    fontFamilies: [
      { label: "Arial" },
      { label: "Calibri" },
      { label: "Cambria" },
      { label: "Times New Roman" },
      { label: "Verdana" },
    ],
    fontFamily: "",
    textColor: "",
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
    const i = el.i,
      title = el.title,
      module = el.module;
    //el.static = true;

    return (
      <div
        key={i}
        data-grid={el}
        style={{
          padding: "5px",
          backgroundColor: el.backgroundColor,
          borderColor: el.borderColor,
          borderWidth: el.borderWidth,
          borderRadius: el.borderRadius,
          backgroundImage: el.backgroundImage,
        }}
      >
        <p>{title}</p>
        <p>{module}</p>
        {/* <CustomInput
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
        <Autocomplete
          id="country-select-demo"
          className={this.props.classes.option}
          options={this.state.itemsDetails[i]}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              className={this.props.classes.textfield}
              {...params}
              label="Choose a module"
              variant="outlined"
            />
          )}
        /> */}
        <span
          className={this.props.classes.removeItemIcon}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          <IconButton color="secondary" iconStyle={{ width: 30, height: 30 }}>
            <DeleteForever />
          </IconButton>
        </span>
        <span
          className={this.props.classes.editItemIcon}
          onClick={() => this.handleEdit(i)}
        >
          <IconButton color="secondary" iconStyle={{ width: 30, height: 30 }}>
            <Edit style={{ color: "darkcyan" }} />
          </IconButton>
        </span>
      </div>
    );
  }

  onAddItem = () => {
    let newId = "";
    try {
      newId = parseInt(this.state.items[this.state.items.length - 1]["i"]) + 1;
    } catch (err) {
      console.log(err);
    }

    let items = this.state.items;
    items.push({
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: "1px",
      borderRadius: "5px",
      backgroundImage: "",
      title: "New Box",
      module: "Select Module",
      i: newId + "",
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 2,
      h: 2,
    });
    this.setState({
      // Add a new item. It must have a unique key!
      items: items,
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

  handleEdit = (index) => {
    this.setState({
      itemOnEditIndex: index,
      showEditMenu: !this.state.showEditMenu,
    });
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

  handleBoxSpacing = async (event, newValue) => {
    if (this.state.config.layoutBoxSpacing[0] !== newValue) {
      let config = this.state.config;
      config = { layoutBoxSpacing: [newValue, newValue] };
      this.setState({ config: config });
    }
  };

  handleBorderWidth = (event, newValue) => {
    this.setState({ itemBorderWidth: newValue });
  };

  handleBorderRadius = (event, newValue) => {
    this.setState({ itemBorderRadius: newValue });
  };

  handleItemBgImage = (event) => {
    let imgSrc = event.target.value.split("\\")[2];
    this.setState({ imgSrc: `assets/img/${imgSrc}` });
  };

  closeEditSideMenu = () => {
    this.setState({ showEditMenu: false });
  };

  getBoxById(id) {
    let item = {};
    let index = 0;
    this.state.items.map((el, i) => {
      if (el.i === id) {
        item = el;
        index = i;
      }
    });
    return { item: item, index: index };
  }

  saveChangedStyle = () => {
    let foundItem = this.getBoxById(this.state.itemOnEditIndex);

    foundItem.item.backgroundColor = this.state.itemBgColor;
    foundItem.item.borderColor = this.state.itemBorderColor;
    foundItem.item.borderWidth = this.state.itemBorderWidth;
    foundItem.item.borderRadius = this.state.itemBorderRadius;
    foundItem.item.backgroundImage = this.state.itemImgSrc;

    let items = this.state.items;
    items[foundItem.index] = foundItem.item;

    this.setAsyncState({
      items: items,
    });

    this.closeEditSideMenu();
  };

  getImage = () => {
    if (this.state.itemImgSrc !== "") {
      let bg = require("assets/img/watermelon.jpg");
      return bg;
    }
  };

  handleBgImage(file) {
    this.setState({
      bgImage: file,
    });
  }

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
        MuiInputBase: {
          root: {
            width: "100%",
            margin: "0 auto",
          },
        },
        MuiInputLabel: {
          formControl: {
            width: "90%",
            marginLeft: "1%",
          },
        },

        MuiFormLabel: {
          root: {
            marginLeft: "5%",
          },
        },

        MuiAutocomplete: {
          endAdornment: {
            position: "absolute",
            top: "calc(50% - 14px)",
            right: "0px !important",
          },
        },
        MuiOutlinedInput: {
          root: {
            borderRadius: "",
            width: "100%",
            backgroundColor: "white",
            margin: "0 auto",
            height: "50px",
          },
        },
        MuiPaper: {
          root: {},
        },
      },
    });
  };

  handleFontSize = async (event, newValue) => {
    if (this.state.fontSize !== newValue) {
      await this.setAsyncState({ fontSize: newValue });
    }
  };

  handleFontFamily = (event, newValue) => {
    this.setState({ fontFamily: newValue.label });
  };

  render() {
    const classes = this.props.classes;
    const { color, absolute, fixed } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: this.state.bgColor,
            fontSize: `${this.state.fontSize}rem`,
            fontFamily: this.state.fontFamily,
            color: this.state.textColor,
          }}
          className={classes.bodyWrapper}
        >
          <div style={{ marginTop: "60px" }} className={classes.root}></div>
          <MuiThemeProvider theme={this.getTheme()}>
            <Drawer
              variant="temporary"
              anchor={"left"}
              open={this.state.showEditMenu}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={this.handleEditMenu}
            >
              <h3 style={{ textAlign: "center", marginBottom: "50px" }}>
                Edit Box Properties
              </h3>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "400", marginBottom: "5px" }}>
                  Background Color
                </div>
                <ColorPicker
                  name="color"
                  defaultValue="#000"
                  // value={this.state.color} - for controlled component
                  onChange={(color) => {
                    if (color) {
                      this.setState({ itemBgColor: color });
                    }
                  }}
                />
              </div>
              <hr />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "400", marginBottom: "5px" }}>
                  Border Color
                </div>
                <ColorPicker
                  name="color"
                  defaultValue="#000"
                  onChange={(color) => {
                    if (color) {
                      this.setState({ itemBorderColor: color });
                    }
                  }}
                />
              </div>
              <hr />
              <div style={{ textAlign: "center" }}>
                <Typography id="discrete-slider" gutterBottom>
                  Border Width
                </Typography>
                <Slider
                  style={{ width: "80%" }}
                  onChange={this.handleBorderWidth}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={20}
                />
              </div>
              <hr />
              <div style={{ textAlign: "center" }}>
                <Typography id="discrete-slider" gutterBottom>
                  Border Radius
                </Typography>
                <Slider
                  style={{ width: "80%" }}
                  onChange={this.handleBorderRadius}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={30}
                />
              </div>
              <hr />
              <div
                style={{ textAlign: "center", margin: "0 auto", width: "80%" }}
              >
                <div style={{ fontWeight: "400", marginBottom: "5px" }}>
                  Background Image
                </div>
                <CustomInput
                  id="bgImage"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) => this.handleItemBgImage(event),
                  }}
                  inputProps={{
                    type: "file",
                    autoComplete: "off",
                  }}
                />
              </div>
              <hr />

              <DialogActions className={classes.modalFooter}>
                <Button
                  disabled={this.state.isBtnDisabled}
                  color="success"
                  simple
                  onClick={this.saveChangedStyle}
                >
                  <div>Save</div>
                </Button>
                <Button color="danger" simple onClick={this.closeEditSideMenu}>
                  Cancel
                </Button>
              </DialogActions>
            </Drawer>
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
              <Accordion className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1c-content"
                  id="panel1c-header"
                >
                  <div className={classes.column}>
                    <Typography
                      style={{ fontSize: "120%" }}
                      className={classes.secondaryHeading}
                    >
                      Page Options
                    </Typography>
                  </div>
                </AccordionSummary>
                <Divider />

                <AccordionDetails className={classes.details}>
                  <div
                    style={{ borderRight: "1px solid darkcyan" }}
                    className={classes.column}
                  >
                    <h4 style={{ textAlign: "center", fontWeight: "400" }}>
                      Background
                    </h4>
                    <h5 style={{ fontSize: "100%", fontWeight: "400" }}>
                      Background Color
                    </h5>
                    <ColorPicker
                      name="color"
                      defaultValue="#000"
                      // value={this.state.color} - for controlled component
                      onChange={(color) => {
                        if (color) {
                          this.setState({ bgColor: color });
                        }
                      }}
                    />
                    <h5 style={{ fontSize: "100%", fontWeight: "400" }}>
                      Background Image
                    </h5>
                    <div style={{ width: "90%" }}>
                      <DropzoneArea onChange={this.handleBgImage.bind(this)} />
                    </div>
                  </div>
                  <p style={{ width: "1%" }} />
                  <div
                    style={{
                      borderRight: "1px solid darkcyan",
                      paddingRight: "1%",
                    }}
                    className={classes.column}
                  >
                    <h4 style={{ textAlign: "center", fontWeight: "400" }}>
                      Font{" "}
                    </h4>
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        Font Size
                      </Typography>
                      <Slider
                        style={{ width: "80%", marginLeft: "10%" }}
                        onChange={this.handleFontSize}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                      />
                    </div>
                    <h5 style={{ fontSize: "100%", fontWeight: "400" }}>
                      Font Family
                    </h5>
                    <Autocomplete
                      id="country-select-demo"
                      onChange={this.handleFontFamily}
                      className={this.props.classes.option}
                      options={this.state.fontFamilies}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField
                          className={this.props.classes.textfield}
                          {...params}
                          label="Choose a Font Family"
                          variant="outlined"
                        />
                      )}
                    />
                    <h5 style={{ fontSize: "100%", fontWeight: "400" }}>
                      Text Color
                    </h5>
                    <ColorPicker
                      name="color"
                      defaultValue="#000"
                      // value={this.state.color} - for controlled component
                      onChange={(color) => {
                        if (color) {
                          this.setState({ textColor: color });
                        }
                      }}
                    />
                  </div>
                  <p style={{ width: "1%" }} />
                  <div className={clsx(classes.column, classes.helper)}>
                    <h4 style={{ textAlign: "center", fontWeight: "400" }}>
                      Miscellaneous
                    </h4>
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        Box Spacing
                      </Typography>
                      <Slider
                        style={{ width: "80%", marginLeft: "10%" }}
                        onChangeCommitted={this.handleBoxSpacing}
                        defaultValue={this.state.config.layoutBoxSpacing[0]}
                        getAriaValueText={() =>
                          this.state.config.layoutBoxSpacing[0] + " pixels"
                        }
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={30}
                      />
                    </div>
                  </div>
                </AccordionDetails>

                <Divider />
                <AccordionActions>
                  <Button size="small">Cancel</Button>
                  <Button size="small" color="primary">
                    Save
                  </Button>
                </AccordionActions>
              </Accordion>
              <div className={classes.pageTitle}>
                <CustomInput
                  labelText="Page Title"
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
                // margin={this.state.boxSpacing} primeste un array cu 2 valori
                isBounded="true"
                margin={this.state.config.layoutBoxSpacing}
                onLayoutChange={() => this.onLayoutChange}
                onBreakpointChange={() => this.onBreakpointChange}
                {...this.props}
              >
                {_.map(this.state.items, (el) => this.createElement(el))}
              </ResponsiveReactGridLayout>
            </div>
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
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagesAdd);
