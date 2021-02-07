import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";

//import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

import Editor from "./themeEditor/src/screen/editor";
import { NavLink } from "react-router-dom";

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

// for 'new theme' modal
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

import { DropzoneArea } from "material-ui-dropzone";
import Slider from "@material-ui/core/Slider";

// for the dropdown inside each field
import { TextField } from "@material-ui/core";
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
    themes: [],
    adminThemes: [],
    createModal: false,
    data: {},
    defaults: {
      title: "",
      bgcolor: "",
      bgimage: "",
      bgrepeat: false,
      bgstretch: false,
      fontsize: "",
      textcolor: "#000000",
      fontfamily: "Arial",
      isdefault: false,
      html2canvasImage: "",
      boxSpacingConfig: {
        layoutBoxSpacing: [10, 10],
        layoutBoxPadding: {
          lg: [1, 1],
          md: [1, 1],
          sm: [1, 1],
          xs: [1, 1],
          xxs: [1, 1],
        }
      }
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
    defaultFontFamily: "Arial",
    showEmptyTitleMessage: false,
    publicType: 0,
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  componentDidMount() {
    let path = this.props.hist.location.pathname.split("/");
    let side = path[2] === "public" ? 0 : 1;

    this.setState({ side });

    let themesInStorage = JSON.parse(localStorage.getItem("publicThemes"));
    if (themesInStorage) {
      this.setState({ themes: themesInStorage });
    }

    let adminThemesInStorage = JSON.parse(
      localStorage.getItem("adminThemes")
    );
    if (adminThemesInStorage) {
      this.setState({ adminThemes: adminThemesInStorage });
    }
  }

  getTheme = () => {
    return createMuiTheme({
      palette: this.props.defaultTheme,
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
      //is admin theme
      let adminThemes = [...this.state.adminThemes];

      let newThemes = adminThemes.filter(
        (tbn) => tbn.id !== this.state.itemToRemoveId
      );

      await this.setAsyncState({
        adminThemes: newThemes,
      });

      localStorage.setItem("adminThemes", JSON.stringify(newThemes));
    } else {
      let themes = [...this.state.themes];

      let newThemes = themes.filter(
        (tbn) => tbn.id !== this.state.itemToRemoveId
      );

      await this.setAsyncState({
        themes: newThemes,
      });

      localStorage.setItem("publicThemes", JSON.stringify(newThemes));
    }

    this.props.tweakTheState();
  };

  enableAddMode = () => {
    this.setState({
      data: Object.assign({}, { basic: this.state.defaults, mui: {} }),
    });
  };

  enableEditMode = async (id) => {
    const tbn = this.state.side
      ? this.state.adminThemes.find((tbn) => tbn.id === id)
      : this.state.themes.find((tbn) => tbn.id === id);

    let data = {};

    data = Object.assign({}, tbn);

    let fullEditorData = createMuiTheme({
      palette: this.state.side ? data : data.mui,
    });

    if (fullEditorData) {
      this.setState({
        fullEditorData,
      });
    }

    await this.setAsyncState({
      data,
    });

    if(this.state.side === 0){
      await this.setAsyncState({
        fontFamilyIndex: this.getFontFamilyIndex(tbn.basic.fontfamily)
      })
    }

    await this.setAsyncState({
      editMode: true,
      createModal: true,
    });
  };

  disableEditMode = () => {
    this.setAsyncState({ editMode: false });
  };

  saveTbnInStorage = () => {
    if (this.state.side) {
      //is admin theme
      localStorage.setItem(
        "adminThemes",
        JSON.stringify(this.state.adminThemes)
      );
    } else {
      localStorage.setItem(
        "publicThemes",
        JSON.stringify(this.state.themes)
      );
    }
  };

  adminThemeList = () => {
    const createTheme = (tbn) => {
      return (
        <React.Fragment>
          <Card
            className={this.props.classes.root}
            style={{ margin: "20px", width: "20%" }}
          >
            <CardActionArea>
              <CardMedia
                onClick={() => this.enableEditMode(tbn.id)}
                style={{ backgroundSize: "contain" }}
                className={this.props.classes.media}
                image={tbn.html2canvasImage}
              />
              <CardContent style={{ textAlign: "center" }}>
                {tbn.title}
              </CardContent>
            </CardActionArea>
            <CardActions style={{ justifyContent: "flex-end" }}>
              <Tooltip title="Edit Theme">
                <IconButton
                  onClick={() => this.enableEditMode(tbn.id)}
                  style={{ cursor: "pointer" }}
                  color="primary"
                  size="medium"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove Theme">
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

    return (
      <div className={this.props.classes.outerWrapper}>
        <div className={this.props.classes.themesWrapper}>
          {this.state.side
            ? this.state.adminThemes.map((tbn) => createTheme(tbn))
            : this.state.themes.map((tbn) => createTheme(tbn))}
        </div>
      </div>
    );
  };

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
              color={this.state.data.basic[targetedColor]}
              onChangeComplete={async (color) => {
                let data = this.state.data;
                data.basic[targetedColor] = color.hex;
                await this.setAsyncState({
                  data: data
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

  handleFontSize = (event, newValue) => {
    return newValue;
  };

  handleFontFamily = (event, newValue) => {
    if (this.state.editMode) {
      let data = this.state.data;
      data.basic.fontfamily = newValue.label;

      let fontFamilyIndex = this.getFontFamilyIndex(newValue.label);

      this.setState({ data, fontFamilyIndex });
    } else {
      this.setState({ defaultFontFamily: newValue.label });
    }
  };

  getFontFamilyIndex(name) {
    let foundFontFamily = this.state.fontFamilies.findIndex((font) => {
      return font.label === name;
    });

    return foundFontFamily;
  }

  handleBoxSpacing = (event, newValue) => {
    if (
      this.state.data.basic.boxSpacingConfig.layoutBoxSpacing[0] !== newValue
    ) {
      let boxSpacingConfig = {
        layoutBoxSpacing: [newValue, newValue],
        layoutBoxPadding: {
          lg: [1, 1],
          md: [1, 1],
          sm: [1, 1],
          xs: [1, 1],
          xxs: [1, 1],
        },
      };

      return boxSpacingConfig;

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
    let themes;

    if (this.state.side) {
      //is admin theme
      themes = this.state.adminThemes;
    } else {
      themes = this.state.themes;
    }

    if (this.state.editMode) {
      if (this.state.data.isdefault) {
        themes = themes.map((tbn) => {
          let newTbn = tbn;
          if (tbn.id !== this.state.data.id) {
            newTbn.isdefault = false;
          }
          return newTbn;
        });
      }

      return this.setAsyncState({ themes: themes });
    } else {
      let newThemes = themes.map((tbn) => {
        let newTbn = tbn;
        newTbn.isdefault = false;
        return newTbn;
      });

      return this.setAsyncState({
        themes: newThemes,
      });
    }
  };

  saveChangedStyle = async () => {
    if(this.state.side === 0){
      await this.setAsyncState({ publicType: 0 });
    }

    if (this.state.side) {
      let adminPreviewElement = document.querySelector("#adminPreviewElement"),
        theme,
        canvas,
        base64image = "";

      if (adminPreviewElement) {
        try {
          canvas = await (()=>{
            return new Promise((resolve) => {
              html2canvas(adminPreviewElement).then((value) => {
                resolve(value);
              }).catch(err=>{
                console.log(err)
                resolve(null);
              });
            });
          })();
          if(canvas){
            base64image = canvas.toDataURL("image/png");
          }

        } catch (err){
          console.log(err);
        }

      }

      theme = Object.assign({}, this.themeEditor.state.theme.palette, {
        title: this.state.data.title,
        id: this.state.data.id || 0,
        isdefault: this.state.data.isdefault,
        html2canvasImage: base64image
      });

      let adminThemes = this.state.adminThemes || [];

      if (!this.state.editMode) {
        let newId = 0;

        this.state.adminThemes.map((tbn) => {
          newId = Number(tbn.id) > Number(newId) ? Number(tbn.id) : newId;
          return tbn;
        });
        newId++;
        theme.id = newId;

        adminThemes.push(theme);
      } else {
        let foundTbnIndex = adminThemes.findIndex(
          (tbn) => tbn.id === this.state.data.id
        );

        adminThemes[foundTbnIndex] = theme;
      }

      await this.setAsyncState({
        adminThemes,
      });
    } else {
      let previewElement = document.querySelector("#previewElement");
      let canvas;
      let base64image = "";

      this.hideMenu();

      if (previewElement) {
        try {
          canvas = await (()=>{
            return new Promise((resolve) => {
              html2canvas(previewElement).then((value) => {
                resolve(value);
              }).catch(err=>{
                console.log(err)
                resolve(null);
              });
            });
          })();
          if(canvas){
            base64image = canvas.toDataURL("image/png");
          }
        } catch(err) {
          console.log(err);
        }

      }

      let theme = {
        id: this.state.data.id || 0,
        title: this.state.data.title,
        isdefault: this.state.data.isdefault,
        html2canvasImage: base64image,
        basic: {
          bgcolor: this.state.data.basic.bgcolor,
          bgimage: this.state.data.basic.bgimage,
          fontsize: this.state.data.basic.fontsize,
          textcolor: this.state.data.basic.textcolor,
          fontfamily: this.state.data.basic.fontfamily,
          boxSpacingConfig: this.state.data.basic.boxSpacingConfig,
          bgrepeat: this.state.data.basic.bgrepeat,
          bgstretch: this.state.data.basic.bgstretch,
        },
        mui: this.themeEditor.state.theme.palette,
      };

      let themes = this.state.themes || [];

      if (!this.state.editMode) {
        let newId = 0;

        this.state.themes.map((tbn) => {
          newId = Number(tbn.id) > Number(newId) ? Number(tbn.id) : newId;
          return tbn;
        });

        newId++;
        theme.id = newId;
        themes.push(theme);
      } else {
        let foundTbnIndex = themes.findIndex(
          (tbn) => tbn.id === this.state.data.id
        );

        themes[foundTbnIndex] = theme;
      }

      await this.setAsyncState({
        themes,
      });
      this.showMenu();
    }

    this.saveTbnInStorage();

    this.disableEditMode();

    this.setState({ createModal: false, showEmptyTitleMessage: false });

    this.props.tweakTheState();
  };

  showMenu() {
    this.setState({ showEditorMenu: true });
  }

  hideMenu() {
    this.setState({ showEditorMenu: false });
  }

  getFontFamilyItem(name) {
    return this.state.fontFamilies[
      this.state.fontFamilies.findIndex((font) => {
        return font.label === name;
      })
    ];
  }

  openEditor() {

    let bgColorStyles, textColorStyles;

    if (!this.state.side) {
      bgColorStyles = this.sendStyles(this.state.data.basic.bgcolor);
      textColorStyles = this.sendStyles(this.state.data.basic.textcolor);
    }

    let a13yProps = (index) => {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    };

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
            {this.state.editMode ? "Edit Theme" : "New Theme"}
          </h4>
        </DialogTitle>
        <DialogContent
          style={{ overflow: "auto" }}
          id="classic-modal-slide-description"
          className={this.props.classes.modalBody}
        >
          {this.state.side ? (
            <React.Fragment>
              <div className={this.props.classes.modalHeadWrapper}>
                <div className={this.props.classes.modalHeadColumn}>
                  {this.state.showEmptyTitleMessage ? (
                    <div style={{ fontWeight: 900, color: "red" }}>
                      Please type in a title for this theme
                    </div>
                  ) : (
                    ""
                  )}
                  <CustomInput
                    labelText="Theme Title"
                    id="themeTitle"
                    required="required"
                    formControlProps={{
                      fullWidth: true,
                      onChange: (event) => {
                        let data = this.state.data;
                        data.title = event.target.value;
                        this.setState({ data });
                      },
                    }}
                    inputProps={{
                      inputProps: {
                        minLength: "3",
                        maxLength: "50",
                      },
                      defaultValue: this.state.data.title,

                      type: "text",
                    }}
                  />

                  <Typography gutterBottom>
                    <Tooltip title="Set as theme for all pages">
                      <Switch
                        defaultChecked={this.state.data.isdefault}
                        onChange={(event) => {
                          let data = this.state.data;
                          data.isdefault = event.target.checked;
                          this.setState({ data });
                        }}
                      />
                    </Tooltip>
                    Default Theme
                  </Typography>
                </div>
              </div>

              <Editor
                visibleMenu={this.state.showEditorMenu}
                id="adminPreviewElement"
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
              <div className={this.props.classes.modalHeadWrapper}>
                <div>
                  <AppBar position="static" style={{ width: "100%" }}>
                    <Tabs
                      value={this.state.publicType}
                      onChange={this.togglePublicType}
                    >
                      <Tab label="Basic Editor" {...a13yProps(0)} />
                      <Tab label="Material UI Theme Editor" {...a13yProps(1)} />
                    </Tabs>
                  </AppBar>
                </div>

                {this.state.showEmptyTitleMessage ? (
                  <div style={{ fontWeight: 900, color: "red" }}>
                    Please type in a title for this theme
                  </div>
                ) : (
                  ""
                )}

                <div style={{display:"flex"}}>
                  <CustomInput
                    labelText="Theme Title"
                    id="themeTitle"
                    required="required"
                    formControlProps={{
                      fullWidth: true,
                      onChange: (event) => {
                        let data = this.state.data;
                        data.title = event.target.value;
                        this.setState({ data });
                      },
                    }}
                    inputProps={{
                      inputProps: {
                        minLength: "3",
                        maxLength: "50",
                      },
                      defaultValue: this.state.data.title,

                      type: "text",
                    }}
                  />
                  <Typography gutterBottom>
                    <Tooltip title="Set as theme for all pages">
                      <Switch
                        defaultChecked={this.state.data.isdefault}
                        onChange={(event) => {
                          let data = this.state.data;
                          data.isdefault = event.target.checked;
                          this.setState({ data });
                        }}
                      />
                    </Tooltip>
                    Default Theme
                  </Typography>
                </div>
              </div>

              <div
                style={{
                  height: "100%",
                  display: this.state.publicType === 1 ? "block" : "none",
                }}
              >
                <Editor
                  visibleMenu={this.state.showEditorMenu}
                  id="adminPreviewElement"
                  currentTheme={
                    this.state.editMode ? this.state.fullEditorData : ""
                  }
                  style={{
                    height: "100%",
                  }}
                  ref={(editor) => {
                    this.themeEditor = editor;
                  }}
                />
              </div>

              <div
                style={{
                  display: this.state.publicType === 0 ? "block" : "none",
                }}
              >
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
                      <DropzoneArea onChange={this.handleBgImage.bind(this)} />
                    </div>
                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        <Tooltip title="Background Repeat">
                          <Switch
                            defaultChecked={!this.state.side && this.state.data.basic.bgrepeat}
                            onChange={(event) => {
                              let data = this.state.data;
                              data.basic.bgrepeat = event.target.checked;
                              this.setState({data});
                            }}
                          />
                        </Tooltip>
                        Background Repeat
                      </Typography>
                    </div>

                    <div>
                      <Typography id="discrete-slider" gutterBottom>
                        <Tooltip title="Background Stretch">
                          <Switch
                            defaultChecked={!this.state.side && this.state.data.basic.bgrepeat}
                            onChange={(event) => {
                              if(this.state.side) return;
                              let data = this.state.data;
                              data.basic.bgrepeat = event.target.checked;
                              this.setState({
                                data
                              })
                            }}
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
                        onChange={(event, newValue) => {
                          let data = this.state.data;
                          data.basic.fontsize = newValue;
                          this.setState({data});
                        }}
                        defaultValue={this.state.data.basic.fontsize}
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
                      value={
                        this.state.editMode
                          ? this.state.fontFamilies[this.state.fontFamilyIndex]
                          : this.getFontFamilyItem(this.state.defaultFontFamily)
                      }
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
                      onChangeCommitted={(event, newValue) => {
                        let boxSpacingConfig = this.handleBoxSpacing(event,newValue);
                        let data = this.state.data;
                        data.basic.boxSpacingConfig = boxSpacingConfig;
                        this.setState({
                          data
                        });
                      }}
                      defaultValue={
                        this.state.data.basic.boxSpacingConfig.layoutBoxSpacing
                          ? Number(
                          this.state.data.basic.boxSpacingConfig.layoutBoxSpacing[0]
                            )
                          : Number(
                              this.state.defaults.boxSpacingConfig
                                .layoutBoxSpacing[0]
                            )
                        // this.state.data.basic.boxSpacingConfig
                        //   .layoutBoxSpacing[0]
                      }
                      getAriaValueText={
                        () =>
                          this.state.data.basic.boxSpacingConfig.layoutBoxSpacing
                            ? this.state.data.basic.boxSpacingConfig.layoutBoxSpacing[0] +
                              " pixels"
                            : this.state.defaults.boxSpacingConfig
                                .layoutBoxSpacing[0] + " pixels"
                        // this.state.data.basic.boxSpacingConfig
                        //   .layoutBoxSpacing[0] + " pixels"
                      }
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={150}
                    />
                  </div>
                </div>

                <div>
                  <h4 className={this.props.classes.previewHead}>Preview</h4>
                  <div id="previewElement" style={{
                    width: "700px",
                    height: "700px",
                  }}>
                    <div style={{
                      width: "700px",
                      height: "700px",
                      margin: "0 auto",
                      padding: "10px",
                      backgroundColor: this.state.data.basic.bgcolor,
                      backgroundImage: `url(${this.state.data.basic.bgimage})`,
                      color: this.state.data.basic.textcolor,
                      fontSize: this.state.data.basic.fontsize,
                      fontFamily: this.state.data.basic.fontfamily,
                      backgroundRepeat: this.state.data.basic.bgrepeat
                        ? "repeat"
                        : "no-repeat",
                      backgroundSize: this.state.data.basic.bgstretch
                        ? "cover"
                        : "auto",
                    }} >
                      <AppBar
                        style={{
                          backgroundColor: "inherit",
                          color: "inherit",
                          fontSize: "inherit",
                          fontFamily: "inherit",
                        }}
                        position="static"
                      >
                        <p style={{ fontSize: "inherit", fontFamily: "inherit" }}>Home page</p>
                      </AppBar>

                      <div
                        style={{
                          height: "calc(100% - 27px)",
                          backgroundColor: "inherit",
                          color: "inherit",
                          fontSize: "inherit",
                          fontFamily: this.state.data.basic.fontfamily,
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
                          &nbsp;&nbsp; Web design encompasses many different
                          skills and disciplines in the production and maintenance
                          of websites. The different areas of web design include
                          web graphic design; user interface design (UI design);
                          authoring, including standardised code and proprietary
                          software; user experience design (UX design); and search
                          engine optimization. Often many individuals will work in
                          teams covering different aspects of the design process,
                          although some designers will cover them all.[1] The term
                          "web design" is normally used to describe the design
                          process relating to the front-end (client side) design
                          of a website including writing markup. Web design
                          partially overlaps web engineering in the broader scope
                          of web development. Web designers are expected to have
                          an awareness of usability and if their role involves
                          creating markup then they are also expected to be up to
                          date with web accessibility guidelines.
                        </div>
                      </div>
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
            onClick={async () => {
              if (!this.state.data.title.length) {
                await this.setAsyncState({
                  showEmptyTitleMessage: true,
                });
                return;
              }

              if(!this.state.side){
                let data = this.state.data;

                  data.basic.bgrepeat =  this.state.data.basic.bgrepeat;
                  data.basic.bgstretch =  this.state.data.basic.bgstretch;
                  data.basic.fontsize =  this.state.data.basic.fontsize;
                  data.basic.fontfamily =  this.state.data.basic.fontfamily;
                  data.basic.boxSpacingConfig =  this.state.data.basic.boxSpacingConfig;
                this.setState({ data });
              }

              await this.handleDefault();
              this.saveChangedStyle();
            }}
          >
            <div>Save</div>
          </Button>
          <Button
            color="danger"
            onClick={() => {
              this.disableEditMode();
              this.setState({
                createModal: false,
                showEmptyTitleMessage: false,
              });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  changeTab = (event, newValue) => {
    this.setState({ side: newValue });
    localStorage.setItem("side", JSON.stringify(newValue));
  };

  togglePublicType = (event, newValue) => {
    this.setState({ publicType: newValue, showEmptyTitleMessage: false });
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
          <h4>Remove Selected Theme</h4>
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

    return (
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
              <Tab label="Public" href="/themes/public" component="a" onClick={(event) => {
                event.preventDefault();
              }} {...a11yProps(0)} />
              <Tab label="Admin" href="/themes/admin" component="a" onClick={(event) => {
                event.preventDefault();
              }} {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <div style={{ display: "flex" }}>
            {this.adminThemeList()}
          </div>
          <div
            style={{
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <Tooltip title="Add new theme">
              <Fab
                onClick={() => {
                  this.enableAddMode();

                  this.setState({ createModal: true });
                }}
                color="primary"
                aria-label="add"
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </div>
          {this.state.createModal ? this.openEditor() : ""}
          {this.createRemoveTbnModal()}
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(Themes);
