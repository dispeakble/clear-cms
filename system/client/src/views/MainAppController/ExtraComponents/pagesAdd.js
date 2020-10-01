import React from "react";
import _ from "lodash";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import { DeleteForever, AddCircle, Visibility, Edit } from "@material-ui/icons";
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
import Tooltip from "@material-ui/core/Tooltip";
import Close from "@material-ui/icons/Close";

// for speed dial
import Switch from "@material-ui/core/Switch";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

// for the dropdown inside each field
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for the styling side-menu
import Drawer from "@material-ui/core/Drawer";

// for accordeon
import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import { DropzoneArea } from "material-ui-dropzone";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PagesAdd extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    //colsClient: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },//PUT THIS ON PRODUCTION AND PREVIEW
    cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
    rowHeight: 1,
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
    speedDialState: false,
    modulesList: [
      { label: "Header Module" },
      { label: "Menu Module" },
      { label: "Text Module" },
    ],
    config: {
      layoutBoxSpacing: [10, 10],
    },
    editItemFontSizeShow: false,
    editItemFontFamilyShow: false,
    editItemTextColorShow: false,
    editItemBackgroundColorShow: false,
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
    fontSize: "",
    textColor: "#000000",
    fontFamily: "Arial",
    pageTitle: "",
    pageOrItemFontSize: "",
    pageOrItemFontFamily: "",
    pageOrItemTextColor: "",
    displayBgColorPicker: false,
    displayTextColorPicker: false,
    displayItemTextColorPicker: false,
    displayItemBgColorPicker: false,
    displayItemBorderColorPicker: false,
    fontUnit: "px",
    shouldPublish: false,
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

    let itemStyle = {};

    if (el.fontSize) {
      itemStyle.fontSize = `${el.fontSize}${this.state.fontUnit}`;
      itemStyle.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
    } else {
      itemStyle.fontSize = `${this.state.fontSize}${this.state.fontUnit}`;
    }

    if (el.fontFamily) {
      itemStyle.fontFamily = el.fontFamily;
    } else {
      itemStyle.fontFamily = this.state.fontFamily;
    }

    if (el.textColor) {
      itemStyle.color = el.textColor;
    } else {
      itemStyle.color = this.state.textColor;
    }

    if (el.backgroundColor) {
      itemStyle.backgroundColor = el.backgroundColor;
    } else {
      itemStyle.backgroundColor = this.state.bgColor;
    }

    if (el.borderColor) {
      itemStyle.borderColor = el.borderColor;
    }

    if (el.borderWidth) {
      itemStyle.borderWidth = el.borderWidth;
    }

    if (el.borderRadius) {
      itemStyle.borderRadius = el.borderRadius;
    }

    if (el.backgroundImage) {
      itemStyle.backgroundImage = el.backgroundImage;
    }

    //adding default box styles
    itemStyle.padding = "5px";

    return (
      <div key={i} data-grid={el} style={itemStyle}>
        <p style={{ fontSize: "inherit", color: "inherit" }}>{el.title}</p>
        <p style={{ fontSize: "inherit", color: "inherit" }}>{el.module}</p>
        <div
          style={{
            position: "absolute",
            right: "0",
            bottom: "0",
            left: "0",
            background: "white",
          }}
        >
          <span
            className={this.props.classes.removeItemIcon}
            onClick={this.onRemoveItem.bind(this, i)}
          >
            <Tooltip title="Delete">
              <IconButton color="secondary" size="medium">
                <DeleteForever />
              </IconButton>
            </Tooltip>
          </span>
          <span
            className={this.props.classes.editItemIconWrapper}
            onClick={() => this.handleEdit(el.i)}
          >
            <Tooltip title="Edit">
              <IconButton color="secondary" size="medium">
                <Edit className={this.props.classes.editItemIcon} />
              </IconButton>
            </Tooltip>
          </span>
        </div>
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
    let newId = "1";
    try {
      this.state.items.map((item) => {
        newId = Number(item.i) > Number(newId) ? item.i : newId;
      });
      newId++;
      newId += "";
    } catch (err) {
      console.log(err);
    }

    let items = this.state.items;
    items.push({
      title: "New Box",
      module: "",
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: "0",
      borderRadius: "0",
      backgroundImage: "",
      i: newId + "",
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 2,
      h: 20,
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
      itemEditId: "",
    });
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
      editItemBackgroundColor: item.backgroundColor || "",
      editItemFontSize: item.fontSize || "",
      editItemFontFamily: this.getFontFamilyIndex(item.fontFamily) || "",
      editItemTextColor: item.textColor || "",
      editItemBackgroundColorShow: item.hasOwnProperty("backgroundColor"),
      editItemFontSizeShow: item.hasOwnProperty("fontSize"),
      editItemFontFamilyShow: item.hasOwnProperty("fontFamily"),
      editItemTextColorShow: item.hasOwnProperty("textColor"),
      // editItemBorderRadius: item.borderRadius,
      // editItemBorderRadius: item.borderRadius,
      // editItemBorderRadius: item.borderRadius,
      // editItemBorderRadius: item.borderRadius,
    });
    console.log(this.state.editItemFontSize);
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

  // for speed dial

  handleSpeedDialClose = () => {
    this.setState({ speedDialState: false });
  };

  handleSpeedDialOpen = () => {
    this.setState({ speedDialState: true });
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
    await this.setAsyncState({
      editItemFontSize: newValue,
      pageOrItemFontSize: "item",
    });
  };

  handleItemFontFamily = async (event, newValue) => {
    const fontFamily = newValue ? this.getFontFamilyIndex(newValue.label) : "";

    await this.setAsyncState({
      editItemFontFamily: fontFamily,
      pageOrItemFontFamily: "item",
    });
  };

  handleItemModule = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
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

    if (this.state.editItemBackgroundColorShow) {
      foundItem.backgroundColor = this.state.editItemBackgroundColor;
    } else {
      delete foundItem.backgroundColor;
    }

    if (this.state.editItemFontSizeShow) {
      foundItem.fontSize = this.state.editItemFontSize;
    } else {
      delete foundItem.fontSize;
    }

    if (this.state.editItemFontFamilyShow) {
      foundItem.fontFamily = this.state.fontFamilies[
        this.state.editItemFontFamily
      ];

      foundItem.fontFamily = foundItem.fontFamily
        ? foundItem.fontFamily.label
        : "";

      if (!foundItem.fontFamily) {
        delete foundItem.fontFamily;
      }
    } else {
      delete foundItem.fontFamily;
    }

    if (this.state.editItemTextColorShow) {
      foundItem.textColor = this.state.editItemTextColor;
    } else {
      delete foundItem.textColor;
    }

    if (Number(foundItem.borderWidth)) {
      foundItem.borderColor = this.state.editItemBorderColor;
      foundItem.borderWidth = this.state.editItemBorderWidth;
      foundItem.borderRadius = this.state.editItemBorderRadius;
      foundItem.borderStyle = "solid";
    } else {
      delete foundItem.borderColor;
      delete foundItem.borderWidth;
      delete foundItem.borderRadius;
      delete foundItem.borderStyle;
    }

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
        MuiDropzoneArea: {
          root: {
            height: "145px",
            minHeight: "145px",
          },
          text: {
            fontSize: "1rem",
          },
        },
      },
    });
  };

  handleFontSize = async (event, newValue) => {
    if (this.state.fontSize !== newValue) {
      await this.setAsyncState({
        fontSize: newValue,
        pageOrItemFontSize: "page",
      });
    }
  };

  handleFontFamily = async (event, newValue) => {
    await this.setAsyncState({
      fontFamily: newValue.label,
      pageOrItemFontFamily: "page",
    });
  };

  sendStyles = (targetedColor) => {
    return reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: targetedColor,
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });
  };

  // for color pickers

  handleClick = (displayColorPicker) => {
    this.setState({ [displayColorPicker]: !this.state.displayColorPicker });
  };

  handleColorPickerClose = (displayColorPicker) => {
    this.setState({ [displayColorPicker]: false });
  };

  createColorPicker = (styles, displayColorPicker, targetedColor) => {
    return (
      <div>
        <div
          style={styles.swatch}
          onClick={() => this.handleClick(displayColorPicker)}
        >
          <div style={styles.color} />
        </div>
        {this.state[displayColorPicker] ? (
          <div style={styles.popover}>
            <div
              style={styles.cover}
              onClick={() => this.handleColorPickerClose(displayColorPicker)}
            />
            <SketchPicker
              color={this.state[targetedColor]}
              onChangeComplete={async (color) => {
                await this.setAsyncState({ [targetedColor]: color.hex });
              }}
            />
          </div>
        ) : null}
      </div>
    );
  };

  render() {
    const { history } = this.props;
    const classes = this.props.classes;
    const { color, absolute, fixed } = this.props;

    const bgColorStyles = this.sendStyles(this.state.bgColor);
    const textColorStyles = this.sendStyles(this.state.textColor);
    const itemTextColorStyles = this.sendStyles(this.state.editItemTextColor);
    const itemBgColorStyles = this.sendStyles(
      this.state.editItemBackgroundColor
    );
    const itemBorderColorStyles = this.sendStyles(
      this.state.editItemBorderColor
    );

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
                      <Tooltip title="Enable Custom Font Size">
                        <Switch
                          checked={this.state.editItemFontSizeShow}
                          onChange={() => {
                            this.setState({
                              editItemFontSizeShow: !this.state
                                .editItemFontSizeShow,
                            });
                          }}
                          value={Number(this.state.editItemFontSizeShow)}
                        />
                      </Tooltip>
                      Font Size
                    </Typography>
                    <div
                      style={
                        this.state.editItemFontSizeShow
                          ? {}
                          : { display: "none" }
                      }
                    >
                      <Slider
                        defaultValue={
                          this.state.itemEditId
                            ? Number(
                                this.getItemById(this.state.itemEditId).fontSize
                              )
                            : ""
                        }
                        onChangeCommitted={this.handleItemFontSize}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={5}
                        max={50}
                      />
                    </div>
                  </div>

                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Enable Custom Font Family">
                        <Switch
                          checked={this.state.editItemFontFamilyShow}
                          onChange={() => {
                            this.setState({
                              editItemFontFamily: "",
                              editItemFontFamilyShow: !this.state
                                .editItemFontFamilyShow,
                            });
                          }}
                          value={this.state.editItemFontFamilyShow}
                        />
                      </Tooltip>
                      Font Family
                    </Typography>
                    <div
                      style={
                        this.state.editItemFontFamilyShow
                          ? {}
                          : { display: "none" }
                      }
                    >
                      <Autocomplete
                        onChange={this.handleItemFontFamily}
                        className={this.props.classes.option}
                        value={this.getFontFamilyItem(
                          this.state.editItemFontFamily
                        )}
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
                  </div>

                  <div>
                    <Typography gutterBottom>
                      <Tooltip title="Enable Custom Text Color">
                        <Switch
                          checked={this.state.editItemTextColorShow}
                          onChange={() => {
                            this.setState({
                              editItemTextColor: "#000000",
                              editItemTextColorShow: !this.state
                                .editItemTextColorShow,
                            });
                          }}
                          value={this.state.editItemTextColorShow}
                        />
                      </Tooltip>
                      Text Color
                    </Typography>
                    <div
                      style={
                        this.state.editItemTextColorShow
                          ? {}
                          : { display: "none" }
                      }
                    >
                      {this.createColorPicker(
                        itemTextColorStyles,
                        "displayItemTextColorPicker",
                        "editItemTextColor"
                      )}
                    </div>
                  </div>
                  <div>
                    <Typography gutterBottom>
                      <Tooltip title="Enable Custom Text Color">
                        <Switch
                          onChange={() => {
                            this.setState({
                              editItemBackgroundColorShow: !this.state
                                .editItemBackgroundColorShow,
                            });
                          }}
                          checked={this.state.editItemBackgroundColorShow}
                        />
                      </Tooltip>
                      Background Color
                    </Typography>
                    <div
                      style={
                        this.state.editItemBackgroundColorShow
                          ? {}
                          : { display: "none" }
                      }
                    >
                      {this.createColorPicker(
                        itemBgColorStyles,
                        "displayItemBgColorPicker",
                        "editItemBackgroundColor"
                      )}
                    </div>
                  </div>
                  <div>
                    <Typography gutterBottom>Border Color</Typography>
                    {this.createColorPicker(
                      itemBorderColorStyles,
                      "displayItemBorderColorPicker",
                      "editItemBorderColor"
                    )}
                  </div>
                  <div>
                    <Typography gutterBottom>Border Width</Typography>
                    <Slider
                      defaultValue={
                        this.state.itemEditId
                          ? Number(
                              this.getItemById(this.state.itemEditId)
                                .borderWidth
                            )
                          : ""
                      }
                      className={classes.sideMenuSlider}
                      onChangeCommitted={this.handleBorderWidth}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={10}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom>Border Radius</Typography>
                    <Slider
                      defaultValue={
                        this.state.itemEditId
                          ? Number(
                              this.getItemById(this.state.itemEditId)
                                .borderRadius
                            )
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

                    {this.createColorPicker(
                      bgColorStyles,
                      "displayBgColorPicker",
                      "bgColor"
                    )}

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
                        Font Size
                      </Typography>
                      <Slider
                        className={classes.pageOptionsSlider}
                        onChangeCommitted={this.handleFontSize}
                        defaultValue={Number(this.state.fontSize)}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={5}
                        max={50}
                      />
                    </div>
                    <h5>Text Color</h5>
                    {this.createColorPicker(
                      textColorStyles,
                      "displayTextColorPicker",
                      "textColor"
                    )}

                    <h5>Font Family</h5>
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
                        defaultValue={Number(
                          this.state.config.layoutBoxSpacing[0]
                        )}
                        getAriaValueText={() =>
                          this.state.config.layoutBoxSpacing[0] + " pixels"
                        }
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={150}
                      />
                    </div>
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        Publish
                        <Tooltip title="Enable Publishing">
                          <Switch
                            checked={this.state.shouldPublish}
                            onChange={() => {
                              this.setState({
                                shouldPublish: !this.state.shouldPublish,
                              });
                            }}
                            value={this.state.shouldPublish}
                          />
                        </Tooltip>
                      </Typography>
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
                    inputProps: {
                      minLength: "3",
                      maxLength: "50",
                    },

                    value: this.state.pageTitle,
                    type: "text",
                  }}
                />
              </div>

              {/* titleAndContentWrapper */}
              <div
                style={{
                  backgroundColor: this.state.bgColor,
                  fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                  fontFamily: this.state.fontFamily,
                  color: this.state.textColor,
                }}
              >
                <ResponsiveReactGridLayout
                  style={{
                    backgroundColor: this.state.bgColor,
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.textColor,
                  }}
                  // margin={this.state.boxSpacing} primeste un array cu 2 valori
                  isBounded={true}
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
              disabled={this.state.pageTitle.length === 0}
              onClick={() => {
                let pageConfig = {
                  backgroundColor: this.state.bgColor,
                  fontSize: this.state.fontSize,
                  textColor: this.state.textColor,
                  fontFamily: this.state.fontFamily,
                  layoutBoxSpacing: this.state.config.layoutBoxSpacing,
                  pageTitle: this.state.pageTitle,
                };
                let pagesLength;
                if (JSON.parse(localStorage.getItem("pages")) !== null) {
                  pagesLength = JSON.parse(localStorage.getItem("pages"))
                    .length;
                } else {
                  pagesLength = 0;
                }
                let pages = [];

                let newPage = {
                  id: pagesLength + 1,
                  pageConfig: pageConfig,
                  items: this.state.items,
                };

                if (JSON.parse(localStorage.getItem("pages")) !== null) {
                  pages = JSON.parse(localStorage.getItem("pages"));
                  pages.push(newPage);
                } else {
                  pages.push(newPage);
                }

                localStorage.setItem("pages", JSON.stringify(pages));
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
              icon={<SpeedDialIcon />}
              onClose={this.handleSpeedDialClose}
              onOpen={this.handleSpeedDialOpen}
              open={this.state.speedDialState}
            >
              {this.state.actions.map((action) => (
                <SpeedDialAction
                  className={classes.speedDialAction}
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={this.handleSpeedDialClose}
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
