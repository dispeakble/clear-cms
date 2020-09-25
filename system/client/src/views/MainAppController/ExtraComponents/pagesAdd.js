import _, { indexOf } from "lodash";
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
    showModal: false,
    itemOnDeleteIndex: "",
    isAddBtnDisabled: true,
    items: [],
    newCounter: 0,
    actions: [
      {
        icon: <AddCircle onClick={() => this.onAddItem()} />,
        name: "Add block",
      },
      {
        icon: (
          <a
            className={this.props.classes.links}
            href="/pagePreview"
            target="_blank"
          >
            <Visibility className={this.props.classes.previewIcon} />
          </a>
        ),
        name: "Preview",
      },
    ],
    open: false,
    hidden: false,
    modulesList: [
      { label: "Header Module" },
      { label: "Menu Module" },
      { label: "Text Module" },
    ],
    config: {
      layoutBoxSpacing: [10, 10],
    },
    editItemTitle: "",
    editItemModule: "",
    editItemBgColor: "",
    editItemBorderRadius: "",
    editItemBorderWidth: "",
    editItemBorderColor: "",
    editItemBackgroundColor: "",
    editItemFontSize: "",
    editItemFontFamily: "",
    editItemTextColor: "",
    editItemFontSize: "",
    editItemTextColor: "",
    showEditMenu: false,
    itemEditId: "",
    fontFamilies: [
      { label: "Arial" },
      { label: "Calibri" },
      { label: "Cambria" },
      { label: "Times New Roman" },
      { label: "Verdana" },
    ],
    bgColor: "",
    bgImage: "",
    titleFontSize: "",
    titleTextColor: "",
    fontSize: "",
    textColor: "",
    fontFamily: "Arial",
    pageTitle: "",
  };

  componentDidMount() {
    const items = JSON.parse(localStorage.getItem("items"));

    if (items !== null) {
      this.setState({
        items: items,
      });
    }

    const pageConfig = JSON.parse(localStorage.getItem("pageConfig"));

    if (pageConfig !== null) {
      let savedLayoutBoxSpacing = {
        layoutBoxSpacing: pageConfig.layoutBoxSpacing,
      };
      this.setState({
        bgColor: pageConfig.backgroundColor,
        titleFontSize: pageConfig.pageTitleFontSize,
        titleTextColor: pageConfig.pageTitleTextColor,
        fontSize: pageConfig.fontSize,
        textColor: pageConfig.textColor,
        fontFamily: pageConfig.fontFamily,
        pageTitle: pageConfig.pageTitle,
        config: savedLayoutBoxSpacing,
      });
    }
  }

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
        <p
          style={{
            fontSize: `${el.fontSize}rem`,
            fontFamily: el.fontFamily,
            color: el.textColor,
          }}
        >
          {el.title}
        </p>
        <p
          style={{
            fontSize: `${el.fontSize}rem`,
            fontFamily: el.fontFamily,
            color: el.textColor,
          }}
        >
          {el.module}
        </p>
        <span
          className={this.props.classes.removeItemIcon}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          <IconButton color="secondary" iconStyle={{ width: 30, height: 30 }}>
            <DeleteForever />
          </IconButton>
        </span>
        <span
          className={this.props.classes.editItemIconWrapper}
          onClick={() => this.handleEdit(el.i)}
        >
          <IconButton color="secondary" iconStyle={{ width: 30, height: 30 }}>
            <Edit className={this.props.classes.editItemIcon} />
          </IconButton>
        </span>
      </div>
    );
  }

  // handleItemModule = async (event, newValue) => {
  //   let items = [...this.state.items];

  //   let item = this.getItemById(this.state.itemEditId);
  //   item.module = newValue.label;

  //   items = items.map((box) => {
  //     if (box.i === item.i) {
  //       box = item;
  //     }
  //     return box;
  //   });

  //   await this.setAsyncState({ items });
  // };

  onAddItem = () => {
    let newId = "0";
    try {
      newId = parseInt(this.state.items[this.state.items.length - 1]["i"]) + 1;
    } catch (err) {
      console.log(err);
    }

    let items = this.state.items;
    items.push({
      title: "New Box",
      module: "",
      backgroundColor: "#FFFFFF",
      borderColor: "#000000",
      borderWidth: "1",
      borderRadius: "5",
      backgroundImage: "",
      fontSize: "",
      fontFamily: "",
      textColor: "",
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

  getItemById(id) {
    return this.state.items.find((item) => item.i === id);
  }

  onLayoutChange = (layout) => {
    try {
      let newItems = layout.map((item) => {
        let oldItem = this.getItemById(item.i);
        oldItem["x"] = item["x"];
        oldItem.y = item.y;
        oldItem.w = item.w;
        oldItem.h = item.h;
        return oldItem;
      });

      console.log(layout);
      //let renderedItems = [...this.state.items];
      this.setState({ items: newItems });
    } catch (err) {
      console.log(err);
    }
  };

  onRemoveItem(i) {
    this.setState({
      items: _.reject(this.state.items, { i: i }),
    });
  }

  handleInputChange = async (event) => {
    switch (event.target.id) {
      case "pageTitle":
        let pageTitle = [...this.state.pageTitle];
        pageTitle = event.target.value;
        this.setState({ pageTitle });
        break;
      case "itemTitle":
        // let items = [...this.state.items];

        // let item = this.getItemById(this.state.itemEditId);
        // item.title = event.target.value;

        // let itemIndex = items.findIndex(
        //   (item) => item.i === this.state.itemEditId
        // );

        // items[itemIndex] = item;
        await this.setAsyncState({ editItemTitle: event.target.value + "" });
    }
  };

  closeModal() {
    this.setState({ showModal: false });
  }

  getFontFamilyIndex(name) {
    return this.state.fontFamilies.findIndex((font) => {
      return font.label === name;
    });
  }

  getModuleIndex(name) {
    return this.state.modulesList.findIndex((mod) => {
      return mod.label === name;
    });
  }

  getFontFamilyItem(name) {
    return this.state.fontFamilies[
      this.state.fontFamilies.findIndex((font) => {
        return font.label === name;
      })
    ];
  }

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemEditId: id,
    });
    console.log(this.state.itemEditId);
    const item = this.getItemById(id);

    await this.setAsyncState({
      editItemTitle: item.title,
      editItemModule: this.getModuleIndex(item.module),
      editItemBorderRadius: item.borderRadius,
      editItemBorderWidth: item.borderWidth,
      editItemBorderColor: item.borderColor,
      editItemBackgroundColor: item.backgroundColor,
      editItemFontSize: item.fontSize,
      editItemFontFamily: this.getFontFamilyIndex(item.fontFamily),
      editItemTextColor: item.textColor,
      // editItemBorderRadius: item.borderRadius,
      // editItemBorderRadius: item.borderRadius,
      // editItemBorderRadius: item.borderRadius,
      // editItemBorderRadius: item.borderRadius,
    });
    await this.setAsyncState({
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

  // callConfirmCallback = () => {
  //   this.closeModal();
  //   const { history } = this.props;
  //   history.push("/pages");
  // };

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

  handleBorderWidth = async (event, newValue) => {
    await this.setAsyncState({ editItemBorderWidth: newValue });
  };

  handleBorderRadius = async (event, newValue) => {
    await this.setAsyncState({ editItemBorderRadius: newValue });
  };

  handleItemFontSize = async (event, newValue) => {
    await this.setAsyncState({ editItemFontSize: newValue });
  };

  handleItemFontFamily = async (event, newValue) => {
    await this.setAsyncState({
      editItemFontFamily: this.getFontFamilyIndex(newValue.label),
    });
  };

  handleItemModule = async (event, newValue) => {
    await this.setAsyncState({
      editItemModule: this.getModuleIndex(newValue.label),
    });
  };

  handleItemBgImage = async (event) => {
    console.log("Background Image Updated");
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
    let foundItem = this.getItemById(this.state.itemEditId);

    foundItem.title = this.state.editItemTitle;
    foundItem.module = this.state.modulesList[this.state.editItemModule];
    foundItem.module = foundItem.module ? foundItem.module.label : "";
    foundItem.backgroundColor = this.state.editItemBackgroundColor;
    foundItem.borderColor = this.state.editItemBorderColor;
    foundItem.borderWidth = this.state.editItemBorderWidth;
    foundItem.borderRadius = this.state.editItemBorderRadius;
    foundItem.fontSize = this.state.editItemFontSize;
    foundItem.fontFamily = this.state.fontFamilies[
      this.state.editItemFontFamily
    ];
    foundItem.fontFamily = foundItem.fontFamily
      ? foundItem.fontFamily.label
      : "";
    foundItem.textColor = this.state.editItemTextColor;
    foundItem.backgroundImage = this.state.editItemBackgroundImage;

    let items = this.state.items;
    let foundItemIndex = items.findIndex(
      (item) => item.i === this.state.itemEditId
    );

    items[foundItemIndex] = foundItem;

    this.setAsyncState({
      items,
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

  handleTitleFontSize = async (event, newValue) => {
    if (this.state.fontSize !== newValue) {
      await this.setAsyncState({ titleFontSize: newValue });
    }
  };

  handleFontFamily = async (event, newValue) => {
    await this.setAsyncState({ fontFamily: newValue.label });
  };

  render() {
    const { history } = this.props;
    const classes = this.props.classes;
    const { color, absolute, fixed } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            marginTop: "60px",
            paddingBottom: "60px",
          }}
          className={classes.bodyWrapper}
        >
          <MuiThemeProvider theme={this.getTheme()}>
            <Drawer
              variant="temporary"
              anchor={"left"}
              open={this.state.showEditMenu}
              onClose={this.handleEditMenu}
              className={classes.sideMenu}
            >
              <div className={classes.sideMenuEditor}>
                <div className={classes.sideMenuEditorForm}>
                  <h3>Edit Box Properties</h3>
                  <div>
                    <CustomInput
                      labelText="Title"
                      id="itemTitle"
                      required="required"
                      formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                      }}
                      inputProps={{
                        value: this.state.editItemTitle,
                        type: "text",
                      }}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="moduleDropdown"
                      onChange={this.handleItemModule}
                      className={this.props.classes.option}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      defaultValue={
                        this.state.modulesList[this.state.editItemModule]
                      }
                      options={this.state.modulesList}
                      renderInput={(params) => (
                        <TextField
                          className={this.props.classes.textfield}
                          {...params}
                          label="Choose a module"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      Font Size
                    </Typography>
                    <Slider
                      defaultValue={
                        this.state.itemEditId
                          ? this.getItemById(this.state.itemEditId).fontSize
                          : ""
                      }
                      onChangeCommitted={this.handleItemFontSize}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                    />
                  </div>

                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      Font Family
                    </Typography>
                    <Autocomplete
                      id="fontFamilyDropdown"
                      onChange={this.handleItemFontFamily}
                      className={this.props.classes.option}
                      defaultValue={
                        this.state.fontFamilies[this.state.editItemFontFamily]
                      }
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
                  </div>

                  <div>
                    <Typography gutterBottom>Text Color</Typography>
                    <ColorPicker
                      className={classes.colorPicker}
                      name="color"
                      TextFieldProps={{ value: this.state.editItemTextColor }}
                      defaultValue={this.state.editItemTextColor}
                      onChange={async (color) => {
                        if (color) {
                          await this.setAsyncState({
                            editItemTextColor: color,
                          });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom>Background Color</Typography>
                    <ColorPicker
                      labelText="Background Color"
                      name="color"
                      className={classes.colorPicker}
                      TextFieldProps={{
                        value: this.state.editItemBackgroundColor,
                      }}
                      defaultValue={
                        this.state.itemEditId
                          ? this.getItemById(this.state.itemEditId)
                              .backgroundColor
                          : ""
                      }
                      onChange={async (color) => {
                        if (color) {
                          await this.setAsyncState({
                            editItemBackgroundColor: color,
                          });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom>Border Color</Typography>
                    <ColorPicker
                      name="color"
                      className={classes.colorPicker}
                      TextFieldProps={{
                        value: this.state.editItemBorderColor,
                      }}
                      defaultValue={
                        this.state.itemEditId
                          ? this.getItemById(this.state.itemEditId).borderColor
                          : ""
                      }
                      onChange={async (color) => {
                        if (color) {
                          await this.setAsyncState({
                            editItemBorderColor: color,
                          });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom>Border Width</Typography>
                    <Slider
                      defaultValue={
                        this.state.itemEditId
                          ? this.getItemById(this.state.itemEditId).borderWidth
                          : ""
                      }
                      className={classes.sideMenuSlider}
                      onChangeCommitted={this.handleBorderWidth}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={20}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom>Border Radius</Typography>
                    <Slider
                      defaultValue={
                        this.state.itemEditId
                          ? this.getItemById(this.state.itemEditId).borderRadius
                          : ""
                      }
                      className={classes.sideMenuSlider}
                      onChangeCommitted={this.handleBorderRadius}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={30}
                    />
                  </div>

                  <div>
                    <Typography gutterBottom>Background Image</Typography>
                    <div className={classes.dropzoneAreaWrapper}>
                      <DropzoneArea
                        onChange={this.handleItemBgImage.bind(this)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.sideMenuActionHolder}>
                <Button
                  className={classes.sideMenuSaveBtn}
                  color="primary"
                  onClick={this.saveChangedStyle}
                >
                  Save
                </Button>
                <Button
                  className={classes.sideMenuCancelBtn}
                  color="danger"
                  onClick={this.closeEditSideMenu}
                >
                  Cancel
                </Button>
              </div>
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
                    <Typography className={classes.typography}>
                      Page Options
                    </Typography>
                  </div>
                </AccordionSummary>
                <Divider />

                <AccordionDetails className={classes.accordionDetails}>
                  <div
                    className={classes.column + " " + classes.columnSeparator}
                  >
                    <h4>Background</h4>
                    <h5>Background Color</h5>
                    <ColorPicker
                      TextFieldProps={{ value: this.state.bgColor }}
                      name="color"
                      defaultValue={this.state.bgColor}
                      onChange={async (color) => {
                        if (color) {
                          await this.setAsyncState({ bgColor: color });
                        }
                      }}
                    />
                    <h5>Background Image</h5>
                    <div className={classes.dropzoneAreaWrapper}>
                      <DropzoneArea onChange={this.handleBgImage.bind(this)} />
                    </div>
                  </div>
                  <p />
                  <div
                    className={classes.column + " " + classes.columnSeparator}
                  >
                    <h4>Font </h4>
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        Title Font Size
                      </Typography>
                      <Slider
                        className={classes.pageOptionsSlider}
                        value={
                          this.state.titleFontSize
                            ? Number(this.state.titleFontSize)
                            : ""
                        }
                        onChangeCommitted={this.handleTitleFontSize}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                      />
                    </div>
                    <h5>Title Text Color</h5>
                    <ColorPicker
                      name="color"
                      TextFieldProps={{ value: this.state.titleTextColor }}
                      defaultValue={this.state.titleTextColor}
                      onChange={async (color) => {
                        if (color) {
                          await this.setAsyncState({ titleTextColor: color });
                        }
                      }}
                    />
                    <Divider className={classes.titleVsPageDivider} />
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        Page Font Size
                      </Typography>
                      <Slider
                        className={classes.pageOptionsSlider}
                        onChangeCommitted={this.handleFontSize}
                        value={this.state.fontSize}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                      />
                    </div>
                    <h5>Page Text Color</h5>
                    <ColorPicker
                      name="color"
                      TextFieldProps={{ value: this.state.textColor }}
                      defaultValue={this.state.textColor}
                      onChange={async (color) => {
                        if (color) {
                          await this.setAsyncState({ textColor: color });
                        }
                      }}
                    />
                    <h5>Page Font Family</h5>
                    <Autocomplete
                      id="fontFamilyDropdown"
                      onChange={this.handleFontFamily}
                      className={this.props.classes.option}
                      options={this.state.fontFamilies}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      value={this.getFontFamilyItem(this.state.fontFamily)}
                      renderInput={(params) => (
                        <TextField
                          className={this.props.classes.textfield}
                          {...params}
                          label="Choose a Font Family"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                  <p />
                  <div className={clsx(classes.column, classes.helper)}>
                    <h4>Miscellaneous</h4>
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        Box Spacing
                      </Typography>
                      <Slider
                        className={classes.pageOptionsSlider}
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
              </Accordion>
              <div className={classes.pageTitleInputWrapper}>
                <CustomInput
                  labelText="Page Title"
                  id="pageTitle"
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

              <div
                style={{
                  backgroundColor: this.state.bgColor,
                  fontSize: `${this.state.fontSize}rem`,
                  fontFamily: this.state.fontFamily,
                  color: this.state.textColor,
                }}
              >
                <h5
                  style={{
                    fontSize: `${this.state.titleFontSize}rem`,
                    color: this.state.titleTextColor,
                  }}
                  className={classes.pageTitle}
                >
                  {this.state.pageTitle}{" "}
                </h5>

                <ResponsiveReactGridLayout
                  style={{
                    backgroundColor: this.state.bgColor,
                    fontSize: `${this.state.fontSize}rem`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.textColor,
                  }}
                  // margin={this.state.boxSpacing} primeste un array cu 2 valori
                  isBounded="true"
                  margin={this.state.config.layoutBoxSpacing}
                  onLayoutChange={(layout) => {
                    return this.onLayoutChange(layout);
                  }}
                  onBreakpointChange={() => this.onBreakpointChange}
                  {...this.props}
                >
                  {_.map(this.state.items, (el) => this.createElement(el))}
                </ResponsiveReactGridLayout>
              </div>
            </div>

            <Button
              onClick={() => {
                const pageConfig = {
                  backgroundColor: this.state.bgColor,
                  pageTitleFontSize: this.state.titleFontSize,
                  pageTitleTextColor: this.state.titleTextColor,
                  fontSize: this.state.fontSize,
                  textColor: this.state.textColor,
                  fontFamily: this.state.fontFamily,
                  layoutBoxSpacing: this.state.config.layoutBoxSpacing,
                  pageTitle: this.state.pageTitle,
                };
                localStorage.setItem("pageConfig", JSON.stringify(pageConfig));
                localStorage.setItem("items", JSON.stringify(this.state.items));
              }}
              className={classes.savePageButton}
              color="primary"
            >
              <div>Save</div>
            </Button>
            <Button
              onClick={() => {
                history.push("/pages");
                localStorage.clear();
              }}
              className={classes.cancelPageButton}
              color="danger"
            >
              Discard
            </Button>

            <SpeedDial
              className={classes.speedDial}
              ariaLabel="SpeedDial example"
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
