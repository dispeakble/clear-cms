import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

import Editor from "./themeEditor/src/screen/editor";

import styles from "assets/jss/clear-crm/views/themes.js";
import Button from "components/CustomButtons/Button.js";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/Icon";
import { DeleteForever, Edit, Add as AddIcon } from "@material-ui/icons";
// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// for 'new thumbnail' modal
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

import { DropzoneArea } from "material-ui-dropzone";
import Slider from "@material-ui/core/Slider";

// for the dropdown inside each field
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import { Helmet } from "react-helmet";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";

import html2canvas from "html2canvas";

class Themes extends Component {
  state = {
    id: "",
    side: 0,
    thumbnails: [],
    adminThumbnails: [],
    createModal: false,
    showModal: false,
    data: {
      // de inlocuit newBgImage si editBgImage cu this.data.bgImage etc.
      title: "",
      bgcolor: "",
      bgimage: "",
      fontsize: "",
      textcolor: "",
      fontfamily: "",
      isdefault: false,
      html2canvasImage: "",
      boxSpacingConfig: "",
      bgrepeat: "",
      bgstretch: "",
    },
    onPublic: false,
    onAdmin: false,
    editMode: false,
    displayBgColorPicker: false,
    displayTextColorPicker: false,
    fontFamilies: [
      { label: "Arial" },
      { label: "Calibri" },
      { label: "Cambria" },
      { label: "Times New Roman" },
      { label: "Verdana" },
    ],
    showRemoveTbnModal: false,
    itemToRemoveId: "",

    fontFamilyIndex: "",
    showEditorMenu: true,
    fullEditorData: "",
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  componentDidMount() {
    let thumbnailsInStorage = JSON.parse(localStorage.getItem("publicThemes"));
    if (thumbnailsInStorage) {
      this.setState({ thumbnails: thumbnailsInStorage });
    }

    let adminThumbnailsInStorage = JSON.parse(
      localStorage.getItem("adminThemes")
    );
    if (adminThumbnailsInStorage) {
      this.setState({ adminThumbnails: adminThumbnailsInStorage });
    }
  }

  getTheme = () => {
    const themes = JSON.parse(localStorage.getItem("adminThemes"));

    const defaultTheme = themes.find((theme) => theme.isdefault === true);
    return createMuiTheme({
      palette: defaultTheme,
      overrides: {
        MuiFab: {
          root: {
            boxShadow: "",
          },
        },
        MuiDialog: {
          paper: {
            width: "100%",
          },
          paperWidthSm: {
            maxWidth: "100vw",
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

  setItemToRemoveId = (id) => {
    this.setAsyncState({ itemToRemoveId: id });
  };

  showRemoveTbnModal = (id) => {
    this.setAsyncState({ showRemoveTbnModal: true, itemToRemoveId: id });
  };

  closeRemoveTbnModal = () => {
    this.setAsyncState({ showRemoveTbnModal: false });
  };

  onRemoveItem = async () => {
    if (this.state.side) {
      let adminThumbnails = [...this.state.adminThumbnails];

      let newThumbnails = adminThumbnails.filter(
        (tbn) => tbn.id !== this.state.itemToRemoveId
      );

      await this.setAsyncState({
        adminThumbnails: newThumbnails,
      });

      localStorage.setItem("adminThemes", JSON.stringify(newThumbnails));
    } else {
      let thumbnails = [...this.state.thumbnails];

      let newThumbnails = thumbnails.filter(
        (tbn) => tbn.id !== this.state.itemToRemoveId
      );

      await this.setAsyncState({
        thumbnails: newThumbnails,
      });

      localStorage.setItem("publicThemes", JSON.stringify(newThumbnails));
    }
  };

  getTbnById = (passedId) => {
    return this.state.thumbnails.find((tbn) => tbn.id === passedId);
  };

  enableEditMode = async (id) => {
    const tbn = this.state.side
      ? this.state.adminThumbnails.find((tbn) => tbn.id === id)
      : this.state.thumbnails.find((tbn) => tbn.id === id);

    let data = {};

    let fullEditorData = JSON.parse(localStorage.getItem("fullEditorData"));

    if (this.state.side) {
      data = tbn;

      if (fullEditorData) {
        fullEditorData.palette = data;
      }
    } else {
      data.id = tbn.id;
      data.title = tbn.title;
      data.bgcolor = tbn.bgcolor;
      data.bgimage = tbn.bgimage;
      data.fontsize = tbn.fontsize;
      data.textcolor = tbn.textcolor;
      data.fontfamily = tbn.fontfamily;
      data.isdefault = tbn.isdefault;
      data.boxSpacingConfig = tbn.boxSpacingConfig;
      data.bgrepeat = tbn.bgrepeat;
      data.bgstretch = tbn.bgstretch;
    }

    this.setState({
      data,
      editMode: true,
    });

    if (fullEditorData) {
      this.setState({
        fullEditorData,
      });
    }

    let fontFamilyIndex = this.getFontFamilyIndex(tbn.fontfamily);

    this.setState({
      fontFamilyIndex,
    });

    this.setState({ createModal: true });
  };

  disableEditMode = () => {
    this.setAsyncState({ editMode: false });
  };

  saveTbnInStorage = () => {
    if (this.state.side) {
      localStorage.setItem(
        "adminThemes",
        JSON.stringify(this.state.adminThumbnails)
      );
    } else {
      localStorage.setItem(
        "publicThemes",
        JSON.stringify(this.state.thumbnails)
      );
    }
  };

  createAdminThumbnailsPage = (side) => {
    const createThumbnail = (tbn) => {
      return (
        <React.Fragment>
          <Card
            className={this.props.classes.root}
            style={{ margin: "20px", width: "20%" }}
          >
            <CardActionArea>
              <CardMedia
                style={{ backgroundSize: "contain" }}
                className={this.props.classes.media}
                image={tbn.html2canvasImage}
              />
              <CardContent style={{ textAlign: "center" }}>
                {tbn.title}
              </CardContent>
            </CardActionArea>
            <CardActions style={{ justifyContent: "flex-end" }}>
              <Tooltip title="Edit Thumbnail">
                <IconButton
                  onClick={() => this.enableEditMode(tbn.id)}
                  style={{ cursor: "pointer" }}
                  color="primary"
                  size="medium"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove Thumbnail">
                <IconButton
                  onClick={() => {
                    this.showRemoveTbnModal(tbn.id);
                  }}
                  style={{ cursor: "pointer" }}
                  color="error"
                  size="medium"
                >
                  <DeleteForever />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </React.Fragment>
      );
    };

    let thumbnails = this.state.thumbnails;

    let adminThumbnails = this.state.adminThumbnails;

    console.log(thumbnails);
    console.log(adminThumbnails);

    return (
      <div className={this.props.classes.outerWrapper}>
        <div className={this.props.classes.thumbnailsWrapper}>
          {!this.state.side
            ? thumbnails.map((tbn) => createThumbnail(tbn))
            : adminThumbnails.map((tbn) => createThumbnail(tbn))}
        </div>
      </div>
    );
  };

  showModal = () => {
    this.setAsyncState({ showModal: true });
  };

  closeNewThumbnailModal() {
    this.setAsyncState({ showModal: false });
  }

  openColorPicker = (displayColorPicker) => {
    this.setState({ [displayColorPicker]: !this.state[displayColorPicker] });
  };

  closeColorPicker = (displayColorPicker) => {
    this.setState({ [displayColorPicker]: false });
  };

  createColorPicker = (styles, displayColorPicker, targetedColor) => {
    return (
      <div>
        <div
          style={styles.swatch}
          onClick={() => this.openColorPicker(displayColorPicker)}
        >
          <div style={styles.color} />
        </div>
        {this.state[displayColorPicker] ? (
          <div style={styles.popover}>
            <div style={styles.cover} />
            <SketchPicker
              color={this.state.data[targetedColor]}
              onChangeComplete={(color) => {
                let data = this.state.data;
                data[targetedColor] = color.hex;
                this.setAsyncState({
                  data,
                });
                this.closeColorPicker(displayColorPicker);
              }}
            />
          </div>
        ) : null}
      </div>
    );
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

  handleInputChange = (event, tbnOnEdit) => {
    let data = this.state.data;
    data.title = event.target.value + "";
    this.setState({ data });
  };

  handleItemBgRepeat = async (event) => {
    let data = { ...this.state.data };
    data.bgrepeat = !this.state.data.bgrepeat;

    this.setState({ data });
  };

  handleItemBgStretch = async (event) => {
    let data = { ...this.state.data };
    data.bgstretch = !this.state.data.bgstretch;
    this.setState({ data });
  };

  handleFontSize = (event, newValue) => {
    let data = this.state.data;

    data.fontsize = newValue;

    this.setState({ data });
  };

  handleFontFamily = (event, newValue) => {
    let data = this.state.data;
    data.fontfamily = newValue.label;

    let fontFamilyIndex = this.getFontFamilyIndex(newValue.label);

    this.setState({ data, fontFamilyIndex });
  };

  getFontFamilyIndex(name) {
    let foundFontFamily = this.state.fontFamilies.findIndex((font) => {
      return font.label === name;
    });

    return foundFontFamily;
  }

  handleBoxSpacing = async (event, newValue) => {
    if (this.state.data.boxSpacingConfig.layoutBoxSpacing[0] !== newValue) {
      let boxSpacingConfig = this.state.data.boxSpacingConfig;
      boxSpacingConfig = {
        layoutBoxSpacing: [newValue, newValue],
        layoutBoxPadding: {
          lg: [1, 1],
          md: [1, 1],
          sm: [1, 1],
          xs: [1, 1],
          xxs: [1, 1],
        },
      };

      let data = { ...this.state.data };

      data.boxSpacingConfig = boxSpacingConfig;

      this.setState({ data });
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

  handleBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));

      let data = this.state.data;
      data.bgimage = strings[0];

      await this.setAsyncState({ data });
    }
  };

  handleDefault = () => {
    let thumbnails;

    if (this.state.side) {
      thumbnails = [...this.state.adminThumbnails];
    } else {
      thumbnails = [...this.state.thumbnails];
    }

    let newThumbnails = thumbnails.map((tbn) => {
      let newTbn = tbn;
      newTbn.isdefault = false;
      return newTbn;
    });
    let data = this.state.data;
    data.isdefault = !data.isdefault;
    this.setState({ thumbnails: newThumbnails, data });
  };

  saveChangedStyle = async (previewElement) => {
    if (this.state.side) {
      let adminPreviewElement = document.querySelector("#adminPreviewElement");

      let thumbnail;

      let canvas;
      let base64image;

      if (adminPreviewElement) {
        canvas = await html2canvas(adminPreviewElement);
        base64image = canvas.toDataURL("image/png");
      }

      let fullEditorData = this.themeEditor.state.theme;

      thumbnail = this.themeEditor.state.theme.palette;

      thumbnail.title = this.state.data.title;

      thumbnail.id = this.state.data.id || 0;

      thumbnail.isdefault = this.state.data.isdefault;
      thumbnail.html2canvasImage = base64image;

      let adminThumbnails = this.state.adminThumbnails;

      if (!this.state.editMode) {
        let newId = 0;

        this.state.adminThumbnails.map((tbn) => {
          newId = Number(tbn.id) > Number(newId) ? Number(tbn.id) : newId;
          return tbn;
        });
        newId++;
        thumbnail.id = newId;

        adminThumbnails = adminThumbnails.concat(thumbnail);
      } else {
        let foundTbnIndex = adminThumbnails.findIndex(
          (tbn) => tbn.id === this.state.data.id
        );

        adminThumbnails[foundTbnIndex] = thumbnail;
        fullEditorData.palette = thumbnail;
      }

      await this.setAsyncState({
        adminThumbnails,
      });

      localStorage.setItem("fullEditorData", JSON.stringify(fullEditorData));
    } else {
      let canvas;
      let base64image;

      console.log(previewElement);

      this.hideMenu();

      if (previewElement) {
        canvas = await html2canvas(previewElement);
        base64image = canvas.toDataURL("image/png");
      }

      let thumbnail = {
        id: this.state.data.id || 0,
        title: this.state.data.title,
        bgcolor: this.state.data.bgcolor,
        bgimage: this.state.data.bgimage,
        fontsize: this.state.data.fontsize,
        textcolor: this.state.data.textcolor,
        fontfamily: this.state.data.fontfamily,
        isdefault: this.state.data.isdefault,
        html2canvasImage: base64image,
        boxSpacingConfig: this.state.data.boxSpacingConfig,
        bgrepeat: this.state.data.bgrepeat,
        bgstretch: this.state.data.bgstretch,
      };

      let thumbnails = this.state.thumbnails;

      if (!this.state.editMode) {
        let newId = 0;

        this.state.thumbnails.map((tbn) => {
          newId = Number(tbn.id) > Number(newId) ? Number(tbn.id) : newId;
          return tbn;
        });

        newId++;
        thumbnail.id = newId;
        thumbnails = thumbnails.concat(thumbnail);
      } else {
        let foundTbnIndex = thumbnails.findIndex(
          (tbn) => tbn.id === this.state.data.id
        );

        thumbnails[foundTbnIndex] = thumbnail;
      }

      await this.setAsyncState({
        thumbnails,
      });
      this.showMenu();
    }

    this.saveTbnInStorage();

    this.disableEditMode();

    this.closeNewThumbnailModal();

    this.setState({ createModal: false });
  };

  getTbnOnEdit = (id) => {
    let thumbnails = [...this.state.thumbnails];
    let tbnOnEdit = thumbnails.find((tbn) => tbn.id === id);
    return tbnOnEdit;
  };

  showMenu() {
    this.setState({ showEditorMenu: true });
  }

  hideMenu() {
    this.setState({ showEditorMenu: false });
  }

  createNewThumbnail() {
    const bgColorStyles = this.sendStyles(this.state.data.bgcolor);
    const textColorStyles = this.sendStyles(this.state.data.textcolor);

    let tbnOnEdit = this.getTbnOnEdit(this.state.tbnOnEditId);

    let previewElement = document.querySelector("#previewElement");

    let adminPreviewElement = document.querySelector("#adminPreviewElement");
    console.log(previewElement);

    return (
      <Dialog
        onMouseEnter={() => {
          let data = this.state.data;
          data.isdefault = !!data.isdefault;
          this.setState({ data });
        }}
        style={{ width: "100%" }}
        onBackdropClick="false"
        classes={{
          root: this.props.classes.center,
          paper: this.props.classes.modal,
        }}
        open={true}
        TransitionComponent={this.transition}
        keepMounted
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={this.props.classes.modalHeader}
        >
          <h4 style={{ textAlign: "center" }}>
            {this.state.editMode ? "Edit Thumbnail" : "New Thumbnail"}
          </h4>
        </DialogTitle>
        <DialogContent
          style={{ overflow: "auto" }}
          id="classic-modal-slide-description"
          className={this.props.classes.modalBody}
        >
          {this.state.side ? (
            <React.Fragment>
              <div className={this.props.classes.pageTitleInputWrapper}>
                <CustomInput
                  labelText="Theme Title"
                  id="themeTitle"
                  required="required"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) =>
                      this.handleInputChange(event, tbnOnEdit),
                  }}
                  inputProps={{
                    inputProps: {
                      minLength: "3",
                      maxLength: "50",
                    },
                    value: this.state.data.title,

                    type: "text",
                  }}
                />
              </div>
              <Typography gutterBottom>
                <Tooltip title="Set as theme for all pages">
                  <Switch
                    checked={this.state.data.isdefault}
                    onChange={this.handleDefault}
                  />
                </Tooltip>
                Default Theme
              </Typography>
              <Editor
                visibleMenu={this.state.showEditorMenu}
                id="themeEditor"
                currentTheme={
                  this.state.editMode ? this.state.fullEditorData : ""
                }
                style={{ height: "100%", display: "block" }}
                ref={(editor) => {
                  this.themeEditor = editor;
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className={this.props.classes.pageTitleInputWrapper}>
                <CustomInput
                  labelText="Theme Title"
                  id="themeTitle"
                  required="required"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) =>
                      this.handleInputChange(event, tbnOnEdit),
                  }}
                  inputProps={{
                    inputProps: {
                      minLength: "3",
                      maxLength: "50",
                    },
                    value: this.state.data.title,

                    type: "text",
                  }}
                />
              </div>

              <div className={this.props.classes.newTbnStylesWrapper}>
                <div
                  className={
                    this.props.classes.column +
                    " " +
                    this.props.classes.columnSeparator
                  }
                >
                  <h4>Background</h4>
                  <h5>Background Color</h5>

                  {this.createColorPicker(
                    bgColorStyles,
                    "displayBgColorPicker",
                    "bgcolor"
                  )}
                  <h5>Background Image</h5>
                  <div className={this.props.classes.dropzoneAreaWrapper}>
                    <DropzoneArea
                      onChange={this.handleBgImage.bind(this)}
                      onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                    />
                  </div>
                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Background Repeat">
                        <Switch
                          checked={this.state.data.bgrepeat}
                          onChange={this.handleItemBgRepeat}
                          value={this.state.data.bgrepeat}
                        />
                      </Tooltip>
                      Background Repeat
                    </Typography>
                  </div>

                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Background Stretch">
                        <Switch
                          checked={this.state.data.bgstretch}
                          onChange={this.handleItemBgStretch}
                          value={this.state.data.bgstretch}
                        />
                      </Tooltip>
                      Background Stretch
                    </Typography>
                  </div>
                </div>
                <p />
                <div className={this.props.classes.column}>
                  <h4>Font </h4>
                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      Font Size
                    </Typography>
                    <Slider
                      className={this.props.classes.pageOptionsSlider}
                      onChangeCommitted={this.handleFontSize}
                      value={this.state.data.fontsize}
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
                    "textcolor"
                  )}

                  <h5>Font Family</h5>
                  <Autocomplete
                    id="fontFamilyDropdown"
                    onChange={this.handleFontFamily}
                    className={this.props.classes.option}
                    options={this.state.fontFamilies}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    value={this.state.fontFamilies[this.state.fontFamilyIndex]}
                    renderInput={(params) => (
                      <TextField
                        className={this.props.classes.textfield}
                        {...params}
                        label="Choose a Font Family"
                        variant="outlined"
                      />
                    )}
                  />
                  <Typography id="discrete-slider" gutterBottom>
                    Box Spacing
                  </Typography>
                  <Slider
                    className={this.props.classes.pageOptionsSlider}
                    onChangeCommitted={this.handleBoxSpacing}
                    defaultValue={Number(
                      this.state.data.boxSpacingConfig.layoutBoxSpacing[0]
                    )}
                    getAriaValueText={() =>
                      this.state.data.boxSpacingConfig.layoutBoxSpacing[0] +
                      " pixels"
                    }
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    min={0}
                    max={150}
                  />
                </div>
              </div>
              <Typography gutterBottom>
                <Tooltip title="Set as theme for all pages">
                  <Switch
                    checked={this.state.data.isdefault}
                    onChange={this.handleDefault}
                  />
                </Tooltip>
                Default Theme
              </Typography>

              <div>
                <h4 className={this.props.classes.previewHead}>Preview</h4>
                <div
                  id="previewElement"
                  className={this.props.classes.previewWrapper}
                  style={{
                    backgroundColor: this.state.data.bgcolor,
                    backgroundImage: `url(${this.state.data.bgimage})`,
                    color: this.state.data.textcolor,
                    fontSize: this.state.data.fontsize,
                    fontFamily: this.state.data.fontfamily,
                    backgroundRepeat: this.state.data.bgrepeat
                      ? "repeat"
                      : "no-repeat",
                    backgroundSize: this.state.data.bgstretch
                      ? "cover"
                      : "auto",
                  }}
                >
                  <AppBar
                    style={{
                      backgroundColor: "inherit",
                      color: "inherit",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                    position="static"
                  >
                    <h4 style={{ fontSize: "inherit", fontFamily: "inherit" }}>
                      Header
                    </h4>
                  </AppBar>

                  <div
                    style={{
                      height: "calc(100% - 27px)",
                      backgroundColor: "inherit",
                      color: "inherit",
                      fontSize: "inherit",
                      fontFamily: this.state.data.fontfamily,
                    }}
                    className={this.props.classes.previewBodyWrapper}
                  >
                    <List
                      style={{
                        margin: "10px 15px 5px 5px",
                      }}
                      className={this.props.classes.previewList}
                      component="nav"
                      aria-label="main mailbox folders"
                    >
                      <ListItem button>
                        <ListItemIcon>
                          <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="First Link" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Second Link" />
                      </ListItem>
                    </List>
                    <div className={this.props.classes.previewText}>
                      <h4>
                        <b>Web Design</b>
                      </h4>
                      &nbsp;&nbsp; Web design encompasses many different skills
                      and disciplines in the production and maintenance of
                      websites. The different areas of web design include web
                      graphic design; user interface design (UI design);
                      authoring, including standardised code and proprietary
                      software; user experience design (UX design); and search
                      engine optimization. Often many individuals will work in
                      teams covering different aspects of the design process,
                      although some designers will cover them all.[1] The term
                      "web design" is normally used to describe the design
                      process relating to the front-end (client side) design of
                      a website including writing markup. Web design partially
                      overlaps web engineering in the broader scope of web
                      development. Web designers are expected to have an
                      awareness of usability and if their role involves creating
                      markup then they are also expected to be up to date with
                      web accessibility guidelines.
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </DialogContent>

        <DialogActions className={this.props.classes.modalFooter}>
          <Button
            color="primary"
            onClick={() =>
              this.saveChangedStyle(
                this.state.side ? adminPreviewElement : previewElement
              )
            }
          >
            <div>Save</div>
          </Button>
          <Button
            color="danger"
            onClick={() => {
              this.disableEditMode();
              this.setState({ createModal: false });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  changeTab = (event, newValue) => {
    this.setAsyncState({ side: newValue });
  };

  createRemoveTbnModal() {
    return (
      <Dialog
        style={{ width: "50%", margin: "0 auto" }}
        open={this.state.showRemoveTbnModal}
        TransitionComponent={this.transition}
        keepMounted
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography>
          <h4>Remove Selected Thumbnail</h4>
        </DialogTitle>
        <DialogContent id="classic-modal-slide-description">
          <div>Are you sure you want to proceed ?</div>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.onRemoveItem();
              this.closeRemoveTbnModal();
            }}
          >
            <div>Proceed</div>
          </Button>
          <Button
            color="danger"
            onClick={() => {
              this.closeRemoveTbnModal();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    let a11yProps = (index) => {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    };

    let initialBoxSpacingConfig = {
      layoutBoxSpacing: [10, 10],
      layoutBoxPadding: {
        lg: [1, 1],
        md: [1, 1],
        sm: [1, 1],
        xs: [1, 1],
        xxs: [1, 1],
      },
    };

    return (
      <MuiThemeProvider theme={this.getTheme()}>
        <React.Fragment>
          <Helmet>
            <title>Themes</title>
          </Helmet>
          <AppBar position="static" style={{ marginTop: "52px" }}>
            <Tabs
              value={this.state.side}
              onChange={this.changeTab}
              indicatorColor="secondary"
            >
              <Tab label="Public" {...a11yProps(0)} />
              <Tab label="Admin" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <div style={{ display: "flex" }}>
            {this.createAdminThumbnailsPage(this.state.side)}
          </div>
          <div
            style={{
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <Fab
              onClick={() =>
                this.setState({
                  data: { boxSpacingConfig: initialBoxSpacingConfig },
                  createModal: true,
                })
              }
              color="primary"
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </div>
          {this.state.createModal ? this.createNewThumbnail() : ""}
          {this.createRemoveTbnModal()}
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Themes);
