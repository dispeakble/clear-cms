import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";
import ArtTrack from "@material-ui/icons/ArtTrack";
import { DropzoneArea } from "material-ui-dropzone";

import { DeleteForever, Edit } from "@material-ui/icons";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Drawer from "@material-ui/core/Drawer";

import { ReactSortable } from "react-sortablejs";

class GalleryModule extends Component {
  state = {
    galleryTitle: "",
    galleryTypes: [{ label: "Carousel" }],
    editGalleryType: "",
    temporaryImageSources: [],
    imageSources: [],
    showEditImageMenu: false,
    showDropZone: false,
    editImageTitle: "",
    editImageDescription: "",
    editImageLink: "",
    imageOnEditPath: "",

    // Carousel Add-ons
    infiniteSliding: false,
    fullscreenButton: false,
    playButton: false,
    bullets: false,
    thumbnails: false,
    navigation: false,
    index: false,
    tbnSliding: false,
    playInterval: 2000,
    slideDuration: 450,
  };
  getTheme = () => {
    return createTheme({
      palette: this.props.defaultTheme,
      overrides: {
        MuiDialogTitle: {
          root: {
            padding: "16px 24px 0",
          },
        },
        MuiDialog: {
          paper: {
            width: "100% !important",
          },
          paperWidthSm: {
            maxWidth: "100vw !important",
            width: "100% !important",
          },
        },
      },
    });
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
    await this.setAsyncState({
      editGalleryType: this.state.editGalleryType,
    });
  };

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "galleryTitle":
        let galleryTitle = this.state.galleryTitle;
        galleryTitle = event.target.value + "";
        this.setState({ galleryTitle });
        break;
      case "imageTitle":
        let editImageTitle = this.state.editImageTitle;
        editImageTitle = event.target.value + "";
        this.setState({ editImageTitle });
        break;
      case "imageDescription":
        let editImageDescription = this.state.editImageDescription;
        editImageDescription = event.target.value;
        this.setState({ editImageDescription });
        break;
      case "imageLink":
        let editImageLink = this.state.editImageLink;
        editImageLink = event.target.value;
        this.setState({ editImageLink });
        break;
      case "playInterval":
        let playInterval = this.state.playInterval;
        playInterval = event.target.value;
        this.setState({ playInterval });
        break;
      case "slideDuration":
        let slideDuration = this.state.slideDuration;
        slideDuration = event.target.value;
        this.setState({ slideDuration });
        break;
      default:
        break;
    }
  };

  saveChangedStyle = () => {
    let imageSources = [...this.state.imageSources];

    let imageOnEdit = imageSources.find(
      (img) => img.path === this.state.imageOnEditPath
    );

    imageOnEdit.title = this.state.editImageTitle;
    imageOnEdit.description = this.state.editImageDescription;
    imageOnEdit.link = this.state.editImageLink;

    this.closeEditSideMenu();
  };

  onRemoveItem = async (path) => {
    let imageSources = [...this.state.imageSources];

    let newImageSources = imageSources.filter((img) => img.path !== path);

    this.setState({
      imageSources: newImageSources,
      temporaryImageSources: newImageSources,
    });

    // localStorage.setItem("adminThemes", JSON.stringify(newThumbnails));
  };

  handleUploadedImage = async (event) => {
    let temporaryImageSources = [...this.state.imageSources];

    if (event.length) {
      await Promise.all(
          event.map((file) => {
            if (!temporaryImageSources.includes(file)) {
              temporaryImageSources.push({path: file.path, title: file.title});
            }
            return file;
          })
      );
    }

    this.setState({ temporaryImageSources });
  };

  closeEditSideMenu = () => {
    this.setState({ showEditImageMenu: false });
  };

  handleImageEdit = (path) => {
    let imageSources = [...this.state.imageSources];

    let imageOnEdit = imageSources.find((img) => img.path === path);

    this.setState({
      editImageTitle: imageOnEdit.title,
      editImageDescription: imageOnEdit.description,
      editImageLink: imageOnEdit.link,
    });

    this.setState({ imageOnEditPath: path, showEditImageMenu: true });
  };

  getGalleryIndex(name) {
    return Number(
      this.state.galleryTypes.findIndex((type) => {
        return type.label === name;
      })
    );
  }

  handleGalleryType = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
    await this.setAsyncState({
      editGalleryType: this.getGalleryIndex(newValue.label),
    });
  };

  render() {
    const classes = this.props.classes;

    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={() => this.handleEdit(this.props.boxId)}
          color="primary"
          size="medium"
        >
          <ArtTrack />
        </IconButton>

        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          onBackdropClick={() => "false"}
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={this.state.showModuleOptionsModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeModuleOptionsModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            {" "}
            <Autocomplete
              id="moduleDropdown"
              onChange={this.handleGalleryType}
              className={this.props.classes.option}
              autoHighlight
              getOptionLabel={(option) => option.label}
              defaultValue={this.state.galleryTypes[this.state.editGalleryType]}
              options={this.state.galleryTypes}
              renderInput={(params) => (
                <TextField
                  className={this.props.classes.textfield}
                  {...params}
                  label="Gallery Type"
                  variant="outlined"
                />
              )}
            />
            <CustomInput
              labelText="Gallery Title"
              id="galleryTitle"
              required="required"
              formControlProps={{
                fullWidth: true,
                onChange: (event) => this.handleInputChange(event),
              }}
              inputProps={{
                value: this.state.galleryTitle,
                type: "text",
              }}
            />
            {this.state.editGalleryType === 1 ? (
              <React.Fragment>
                <h4 style={{ textAlign: "center" }}>Optional Add-ons</h4>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "50%" }}>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Allow Infinite Sliding">
                        <Switch
                          checked={this.state.infiniteSliding}
                          onChange={() => {
                            this.setState({
                              infiniteSliding: !this.state.infiniteSliding,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Infinite Sliding
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show Fullscreen Button">
                        <Switch
                          checked={this.state.fullscreenButton}
                          onChange={() => {
                            this.setState({
                              fullscreenButton: !this.state.fullscreenButton,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Fullscreen Button
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show Play Button">
                        <Switch
                          checked={this.state.playButton}
                          onChange={() => {
                            this.setState({
                              playButton: !this.state.playButton,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Play Button
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show Bullets">
                        <Switch
                          checked={this.state.bullets}
                          onChange={() => {
                            this.setState({
                              bullets: !this.state.bullets,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Show Bullets
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show Thumbnails">
                        <Switch
                          checked={this.state.thumbnails}
                          onChange={() => {
                            this.setState({
                              thumbnails: !this.state.thumbnails,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Thumbnails
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show Navigation">
                        <Switch
                          checked={this.state.navigation}
                          onChange={() => {
                            this.setState({
                              navigation: !this.state.navigation,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Navigation
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show Index">
                        <Switch
                          checked={this.state.index}
                          onChange={() => {
                            this.setState({
                              index: !this.state.index,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Index
                    </Typography>

                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Slide on mouse over thumbnails">
                        <Switch
                          checked={this.state.tbnSliding}
                          onChange={() => {
                            this.setState({
                              tbnSliding: !this.state.tbnSliding,
                              open: true,
                            });
                          }}
                        />
                      </Tooltip>
                      Slide on mouse over thumbnails
                    </Typography>
                  </div>

                  <div style={{ width: "50%" }}>
                    <div style={{ width: "90%", margin: "0 auto" }}>
                      <CustomInput
                        labelText="Play Interval"
                        id="playInterval"
                        required="required"
                        formControlProps={{
                          fullWidth: true,
                          onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                          value: this.state.playInterval,
                          type: "text",
                        }}
                      />
                    </div>

                    <div style={{ width: "90%", margin: "0 auto" }}>
                      <CustomInput
                        labelText="Slide Duration"
                        id="slideDuration"
                        required="required"
                        formControlProps={{
                          fullWidth: true,
                          onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                          value: this.state.slideDuration,
                          type: "text",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
            {!this.state.imageSources.length ? (
              <div style={{ padding: "30px 0" }}>No images found.</div>
            ) : (
              !this.state.showDropZone && (
                <ReactSortable
                  list={this.state.imageSources}
                  setList={(newState) => {
                    this.setState({ imageSources: newState });
                  }}
                >
                  {this.state.imageSources.map((img) => (
                    <React.Fragment>
                      <Card
                        className={this.props.classes.root}
                        style={{ margin: "20px", width: "35%" }}
                      >
                        <CardActionArea>
                          <CardMedia
                            onClick={() => this.handleImageEdit(img.path)}
                            style={{ backgroundSize: "contain" }}
                            className={this.props.classes.media}
                            // image="../watermelon.jpg"
                          />
                          <CardContent style={{ textAlign: "center" }}>
                            <h3>{img.title}</h3>
                            <p>{img.description}</p>
                            <img alt={img.title} src="/assets/img/watermelon.jpg" />
                          </CardContent>
                        </CardActionArea>
                        <CardActions style={{ justifyContent: "flex-end" }}>
                          <Tooltip title="Edit Image">
                            <IconButton
                              onClick={() => this.handleImageEdit(img.path)}
                              style={{ cursor: "pointer" }}
                              color="primary"
                              size="medium"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Image">
                            <IconButton
                              onClick={() => {
                                this.onRemoveItem(img.path);
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
                  ))}
                </ReactSortable>
              )
            )}
            <div>
              {this.state.showDropZone ? (
                <React.Fragment>
                  <DropzoneArea
                    clearOnUnmount={true}
                    filesLimit={100}
                    className={this.props.classes.dropzone}
                    onChange={this.handleUploadedImage}
                  />
                  <Button
                    onClick={() => {
                      this.setState({
                        showDropZone: false,
                        imageSources: this.state.temporaryImageSources,
                      });
                    }}
                  >
                    OK
                  </Button>
                  <Button
                    onClick={() => {
                      this.setState({
                        showDropZone: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </React.Fragment>
              ) : (
                ""
              )}
            </div>
            <Button
              style={{ display: this.state.showDropZone ? "none" : "block" }}
              onClick={() => {
                this.setState({
                  showDropZone: true,
                });
              }}
            >
              Upload images
            </Button>
            <Drawer
              BackdropProps={{ invisible: true }}
              variant="temporary"
              anchor={"left"}
              open={this.state.showEditImageMenu}
              onClose={this.handleEditMenu}
              className={this.props.classes.sideMenu}
            >
              <div className={this.props.classes.sideMenuEditor}>
                <div className={this.props.classes.sideMenuEditorForm}>
                  <h3>Edit Image Properties</h3>
                </div>
                <div style={{ width: "90%", margin: "0 auto" }}>
                  <CustomInput
                    labelText="Image Title"
                    id="imageTitle"
                    required="required"
                    formControlProps={{
                      fullWidth: true,
                      onChange: (event) => this.handleInputChange(event),
                    }}
                    inputProps={{
                      value: this.state.editImageTitle,
                      type: "text",
                    }}
                  />
                </div>
                <div style={{ width: "90%", margin: "0 auto" }}>
                  <CustomInput
                    labelText="Image Description"
                    id="imageDescription"
                    required="required"
                    formControlProps={{
                      fullWidth: true,
                      onChange: (event) => this.handleInputChange(event),
                    }}
                    inputProps={{
                      value: this.state.editImageDescription,
                      type: "text",
                      multiline: true,
                      rows: 5,
                    }}
                  />
                </div>
                <div style={{ width: "90%", margin: "0 auto" }}>
                  <CustomInput
                    labelText="Image Link"
                    id="imageLink"
                    required="required"
                    formControlProps={{
                      fullWidth: true,
                      onChange: (event) => this.handleInputChange(event),
                    }}
                    inputProps={{
                      value: this.state.editImageLink,
                      type: "text",
                    }}
                  />
                </div>
              </div>
              <div className={this.props.classes.sideMenuActionHolder}>
                <Button
                  className={this.props.classes.sideMenuSaveBtn}
                  color="primary"
                  onClick={() => {
                    this.saveChangedStyle();
                  }}
                >
                  Save
                </Button>
                <Button
                  className={this.props.classes.sideMenuCancelBtn}
                  color="danger"
                  onClick={() => {
                    this.closeEditSideMenu();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Drawer>
          </DialogContent>
          <DialogActions className={classes.modalFooter}>
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
      </div>
    );
  }
}

export default withStyles(styles)(GalleryModule);
