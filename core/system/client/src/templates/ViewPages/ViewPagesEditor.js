import React, { Suspense } from "react";
import _ from "lodash";
import {
  createTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {
  AddCircle,
  Settings,
  DeleteForever,
  Edit,
  OpenWith,
  Visibility,
  InfoSharp, ScreenShare, StopScreenShare,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { Responsive, WidthProvider } from "react-grid-layout";
import CustomInput from "components/CustomInput/CustomInput.js";
import MoreMenu from "components/MoreMenu/MoreMenu.js";
import GradientPicker from "components/GradientColorPicker/GradientColorPicker";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { withRouter } from "react-router-dom";
import Snackbar from "components/Snackbar/Snackbar.js";

import { Helmet } from "react-helmet";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// for speed dial
import Switch from "@material-ui/core/Switch";

// for the dropdown inside each field
import { TextField, Checkbox } from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

// for the styling side-menu

// for accordion
import clsx from "clsx";
import { DropzoneArea } from "material-ui-dropzone";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

import ViewBoxEditor from "./ViewBoxEditor";
import Modal from "../../components/Modal/Modal";
import ViewPagesPreview from "./ViewPagesPreview";
import PropTypes from "prop-types";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const filter = createFilterOptions();

class ViewPagesEditor extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 1,
    transformScale: 1,
  };

  state = {
    configStates: {
      showBackgroundColor: false,
    },
    showDiscardModal: false,
    showSavedMessage: false,
    showPageOptionsModal: this.props.location.pathname.indexOf("edit") === -1,
    itemOnDeleteIndex: "",
    isAddBtnDisabled: true,
    items: [],
    flatCategories: [],
    speedDialState: false,
    config: {
      layoutBoxSpacing: [10, 10],
      layoutBoxPadding: {
        lg: [0, 0],
        md: [0, 0],
        sm: [0, 0],
        xs: [0, 0],
        xxs: [0, 0],
      },
    },
    showEditMenu: false,
    itemEditId: "",
    itemModuleEditId: "",
    fontFamilies: [
      { label: "Arial" },
      { label: "Calibri" },
      { label: "Cambria" },
      { label: "Times New Roman" },
      { label: "Verdana" },
    ],
    bgColor: "",
    bgGradientColor:"",
    pageBase64Image: false,
    backgroundImage: "",
    backgroundImageFile: "",
    fontSize: 11,
    textColor: "#000000",
    fontFamily: "Arial",
    pageTitle: "",
    pageLink: "",
    showBgColorPicker: false,
    showBgGradientColorPickerModal: false,
    showTextColorPicker: false,
    showItemTextColorPicker: false,
    fontUnit: "px",
    publish: false,
    pageBackgroundRepeat: false,
    pageBackgroundStretch: false,
    pageBackgroundGradient: false,
    defaultPage: false,
    categories: [],
    categoryId: 0,
    currentCategory: null,
    editing: this.props.location.pathname.indexOf("edit") > -1, // we will reuse this component to edit and add pages
    isTemplate: false,
    template: null,
    templates: [],
    pageTransitionPadding: "",
    addAnItem: false,
    backgroundRepeat: false,
    backgroundStretch: false,
    bgColorStyles: {},
    textColorStyles: {},
    editPage: null,
    livePreview: false,
    boxEditorProps: {
      item: {},
    },
    dialogValue: {
      title: "",
      description: "",
    },
    openNewCategory: false,
    isUniqueTitle: false,
    dialogErr: false,
    bgGradientColorPickerModal: {
      name: "bgGradientColorPickerModal",
      title: "Gradient Color Picker",
      content: <GradientPicker selectColor={(color) => this.setState({
        gradientColor: color
      })} />,
      closeButton: {
        callback: () => {
          this.setState({ showBgGradientColorPickerModal: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.setState((prevState) =>{
            return{
              ...prevState,
              showBgGradientColorPickerModal: false,
              bgGradientColor: prevState.gradientColor
            }
          });
        },
        label: "Save",
      },
    },
    showConfirmEditModal: false,
    confirmEditModal: {
      name: "confirmEditModal",
      title: "Confirm Edit",
      content: "This box is from a template. Do you want to open it in a new tab so you can edit it?",
      closeButton: {
        callback: () => {
          this.setState({ showConfirmEditModal: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.setState({ showConfirmEditModal: false });
          const win = window.open(`/pages/edit/${this.state.templateEditId}`, "_blank");
          win.focus();
        },
        label: "Open Template",
      },
    },
    showConfirmDeleteModal: false,
    confirmDeleteModal: {
      name: "confirmDeleteModal",
      title: "Confirm Delete",
      itemId: "",
      content: "This box is from a template. Are you sure you want to delete it?",
      closeButton: {
        callback: () => {
          this.setState({ showConfirmDeleteModal: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.setState({ showConfirmDeleteModal: false });
          this.onRemoveItem(this.state.confirmDeleteModal.itemId);
        },
        label: "Delete Anyway",
      },
    },
  };

  muiTheme = {};
  async fetchAndSet(page_id, isForTemplate) {
    let currentPage = await this.props.control.get({ id: parseInt(page_id) });
    const { pageConfig, items } = currentPage;
    if (items !== null) {

      this.setState({
        categoryId: pageConfig.categoryId,
        currentCategory: this.getCategoryItem(pageConfig.categoryId)
      });
    }

    if (pageConfig !== null) {
      let savedLayoutBoxSpacing = {
        layoutBoxSpacing: pageConfig.layoutBoxSpacing,
        layoutBoxPadding: {
          lg: [0, 0],
          md: [0, 0],
          sm: [0, 0],
          xs: [0, 0],
          xxs: [0, 0],
        },
      };


      await this.setAsyncState({
        bgColor: pageConfig.backgroundColor,
        bgGradientColor: pageConfig.backgroundGradientColor,
        backgroundImage: pageConfig.backgroundImage,
        oldBackgroundImage: pageConfig.backgroundImage,
        fontSize: pageConfig.fontSize,
        textColor: pageConfig.textColor,
        fontFamily: pageConfig.fontFamily,
        ...(!isForTemplate && { pageTitle: pageConfig.pageTitle }),
        pageLink: pageConfig.pageLink,
        defaultConfig: savedLayoutBoxSpacing,
        config: savedLayoutBoxSpacing,
        categoryId: pageConfig.categoryId,
        currentCategory: this.getCategoryItem(pageConfig.categoryId),
        defaultPage: pageConfig.defaultPage,
        publish: pageConfig.publish,
        pageBackgroundRepeat: pageConfig.backgroundRepeat,
        pageBackgroundStretch: pageConfig.backgroundStretch,
        pageBackgroundGradient: pageConfig.backgroundGradient,
        ...(!isForTemplate && { isTemplate: pageConfig.isTemplate }),
        ...(!isForTemplate && { template: { label: pageConfig.templateUsed } }),
      });
    }

    if(isForTemplate) {
      currentPage.items = currentPage.items.map((item) => {
        return {
          ...item,
          templateUsed: page_id,
          resizeHandles: []
        }
      })
    }

    await this.setAsyncState({
      items: currentPage.items,
      pageConfig: currentPage.pageConfig,
      editPage: currentPage.editPage,
    });
  }
  async componentDidMount() {
    let editing = this.state.editing;
    // TODO: debug why match.params is empty
    // let page_id = Number(this.props.match.params.id);
    let page_id = this.props.location.pathObject[2];

    let temps = await this.props.control.listTemplates();
    let templates = [];
    if(temps && temps.length) {
      templates = temps.map((temp) => {
        return {
          id: temp.id,
          label: temp.pageConfig.pageTitle,
        };
      });
    }


    let categoriesFromStorage = await this.props.control.listCategories();

    let categories = this.state.categories;

    if (categoriesFromStorage) {
      categoriesFromStorage.map((category) => {
        categories.push({
          label: category.title,
          id: category.id,
          parentid: category.parentid,
        });
        return category;
      });
      await this.setAsyncState({ categories });

      await this.getAllCategories();
    }

    if (editing) {
      await this.fetchAndSet(page_id);
    } else {

      const defaultPublicTheme = await this.props.control.getPublicTheme();

      this.muiTheme = this.createDefaultTheme();

      if (defaultPublicTheme) {
        if (defaultPublicTheme.bgcolor) {
          this.setState({ bgColor: defaultPublicTheme.bgcolor });
        }
        if (defaultPublicTheme.bgimage) {
          this.setState({ backgroundImage: defaultPublicTheme.bgimage });
        }
        if (defaultPublicTheme.bgrepeat) {
          this.setState({ pageBackgroundRepeat: defaultPublicTheme.bgrepeat });
        }
        if (defaultPublicTheme.bgstretch) {
          this.setState({
            pageBackgroundStretch: defaultPublicTheme.bgstretch,
          });
        }
        if (defaultPublicTheme.bggradient) {
          this.setState({
            pageBackgroundGradient: defaultPublicTheme.bggradient,
          });
        }
        if (defaultPublicTheme.fontsize) {
          this.setState({ fontSize: defaultPublicTheme.fontsize });
        }
        if (defaultPublicTheme.textcolor) {
          this.setState({ textColor: defaultPublicTheme.textcolor });
        }
        if (defaultPublicTheme.fontfamily) {
          this.setState({ fontFamily: defaultPublicTheme.fontfamily });
        }
      }

      if(this.props.location.state.templateMode) {
        this.setState({
          isTemplate: this.props.location.state.templateMode
        })
      }
    }

    await this.setAsyncState({
      bgColorStyles: this.sendStyles(this.state.bgColor),
      textColorStyles: this.sendStyles(this.state.textColor),
    });

    this.setState({
      editing: editing,
      page_id: page_id,
      templates,
    });
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  setTemporaryModuleOptions = (id, data, isVertical) => {
    let allTempModuleOptions = this.state.temporaryModuleOptions;
    allTempModuleOptions[Number(id)] = { data: data, isVertical: isVertical };
    this.setState({ temporaryModuleOptions: allTempModuleOptions });
  };

  preparePageConfiguration() {
    return {
      backgroundColor: this.state.bgColor,
      backgroundGradientColor: this.state.bgGradientColor,
      backgroundImage: this.state.backgroundImage,
      oldBackgroundImage: this.state.oldBackgroundImage,
      backgroundImageFile: this.state.backgroundImageFile,
      fontSize: this.state.fontSize,
      textColor: this.state.textColor,
      fontFamily: this.state.fontFamily,
      layoutBoxSpacing: this.state.config.layoutBoxSpacing,
      pageTitle: this.state.pageTitle,
      pageLink: this.state.pageLink,
      publish: this.state.publish,
      backgroundRepeat: this.state.pageBackgroundRepeat,
      backgroundStretch: this.state.pageBackgroundStretch,
      backgroundGradient: this.state.pageBackgroundGradient,
      defaultPage: this.state.defaultPage,
      categoryId: this.state.categoryId,
      isTemplate: this.state.isTemplate,
      templateUsed: this.state.template?.label,
    }
  }

  createElement(el) {
    const i = el.i;

    let itemStyle = {};

    if (el.showScrollbars) {
      itemStyle.showScrollbars = el.showScrollbars;
    }

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

    if (el.backgroundImageString) {
      itemStyle.backgroundImage = `url(${el.backgroundImageString})`;
    } else {
      itemStyle.backgroundImage = `url(/files/pages/page-${el.templateUsed ? el.templateUsed : this.state.page_id}/box-${i}/${el.backgroundImage})`;
    }

    if (el.backgroundImage.indexOf("__delete__") === 0) {
      el.backgroundImageString = "";
      itemStyle.backgroundImage = "";
    }

    if (el.backgroundRepeat) {
      itemStyle.backgroundRepeat = "repeat";
    } else {
      itemStyle.backgroundRepeat = "no-repeat";
    }

    if (el.backgroundStretch) {
      itemStyle.backgroundSize = "cover";
    } else {
      itemStyle.backgroundSize = "auto";
    }

    if (el.backgroundGradient) {
      itemStyle.backgroundImage = el.backgroundGradientColor;
    }

    if (el.backgroundColor) {
      itemStyle.backgroundColor = el.backgroundColor;
    }

    if (el.borderColor) {
      itemStyle.borderColor = el.borderColor;
    }

    if (el.borderStyle) {
      itemStyle.borderStyle = el.borderStyle;
    }

    if (Number(el.borderWidth)) {
      itemStyle.borderWidth = el.borderWidth;
    } else {
      itemStyle.borderWidth = 1;
      itemStyle.borderStyle = "dashed";
      itemStyle.borderColor = "#CCC";
    }

    if (el.borderRadius) {
      itemStyle.borderRadius = el.borderRadius;
    }

    //adding default box styles
    itemStyle.padding = "5px";

    let LazyModule;
    const loadingFallback = (() => {
      return <span>Loading...</span>;
    })();

    LazyModule = false;

    let moduleType = el.module.replaceAll(" ", "");

    if (el.module) {
      LazyModule = React.lazy(() => import(`./modules/${moduleType}`));
    }

    let itemActions = [
      {
        callback: () => {
          if(el.templateUsed) {
            this.setState((prevState) => {
              return {
                showConfirmDeleteModal: true,
                confirmDeleteModal: {
                  ...prevState.confirmDeleteModal,
                  itemId: el.i
                }
              }
            })
            return
          }
          this.onRemoveItem(el.i);
        },
        icon: (
          <DeleteForever
            style={{ color: this.props.defaultTheme.secondary.main }}
          />
        ),
        name: "Delete box",
      },
      {
        callback: () => {
          return this.handleEditItem(el.i);
        },
        icon: <Edit style={{ color: this.props.defaultTheme.primary.main }} />,
        name: "Edit box",
      },
    ];

    return (
      <div key={i} data-grid={el} style={itemStyle}>
        <div className={this.props.classes.boxContent}>
          <div className={this.props.classes.renderBoxTitle}>
            <h1>{el.title}</h1>
          </div>
          <div style={{ color: "black", verticalAlign: "middle" }}>
            <Tooltip title="Drag Box">
              <IconButton className="MyDragHandleClassName" color="primary">
                <OpenWith color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            {el.module && LazyModule ? (
              <Suspense fallback={loadingFallback}>
                <LazyModule
                  defaultTheme={this.props.defaultTheme}
                  onStartEditingModule={() => this.onStartEditingModule()}
                  onEndEditingModule={() => this.onEndEditingModule()}
                  boxId={el.i}
                  moduleOptions={el.moduleOptions}
                  pageId={this.state.page_id}
                  handleSave={async (id, data) => {
                    await this.saveModuleOptions(id, data);
                  }}
                />
              </Suspense>
            ) : (
              ""
            )}
          </div>
          <div className={this.props.classes.itemSpeedDialWrapper}>
            <MoreMenu itemActions={itemActions} />
          </div>
        </div>
      </div>
    );
  }

  saveModuleOptions = async (passedId, data, isVertical) => {
    let items = [...this.state.items];

    let item = this.getItemById(passedId);

    item.moduleOptions = { data: data, isVertical: isVertical };

    let itemIndex = items.findIndex(
      (item) => Number(item.i) === Number(passedId)
    );

    items[itemIndex] = item;

    await this.setAsyncState({ items });
  };

  async onAddItem() {
    let newId = 0;
    this.setState({
      // Add a new item. It must have a unique key!
      onAddItem: !this.state.onAddItem,
    });
    try {
      this.state.items.map((item) => {
        newId = Number(item.i) > Number(newId) ? Number(item.i) : newId;
        return item;
      });

      newId++;

      let items = this.state.items;
      items.push({
        newItem: true,
        title: "New Box",
        showScrollbars: false,
        module: "",
        moduleOptions: { data: "" },
        borderColor: "#959595", // the lightest grey shade that doesn't bother the eyes
        borderStyle: "solid",
        borderWidth: 0,
        borderRadius: 0,
        backgroundImage: "",
        backgroundImageFile: "",
        backgroundRepeat: false,
        backgroundStretch: false,
        i: newId + "",
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 20,
      });

      await this.setAsyncState({
        // Add a new item. It must have a unique key!
        items: items,
      });
      setTimeout(() => {
        window.scrollTo(0,document.body.scrollHeight);

      }, 500)
    } catch (err) {
      console.log(err);
    }
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  };

  getItemById = (passedId) => {
    return this.state.items.find((item) => item.i === passedId);
  };

  onLayoutChange = (layout, layouts) => {
    try {
      let newItems = layout.map((item) => {
        let oldItem = this.getItemById(item.i);
        oldItem["x"] = item["x"];
        oldItem.y = item.y;
        oldItem.w = item.w;
        oldItem.h = item.h;
        return oldItem;
      });

      this.setState({ items: newItems, layouts });
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
        this.setState({ pageTitle: event.target.value });
        break;
      case "pageLink":
        this.setState({ pageLink: event.target.value });
        break;
      default:
        break;
    }
  };

  closeDiscardModal() {
    this.setState({ showDiscardModal: false });
  }

  closePageOptionsModal() {
    this.setState({ showPageOptionsModal: false });
  }

  openPageOptionsModal() {
    this.setState({ showPageOptionsModal: true });
  }

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  getModuleIndex(name) {
    return Number(
      this.state.modulesList.findIndex((mod) => {
        return mod.label === name;
      })
    );
  }

  getFontFamilyItem(name) {
    return this.state.fontFamilies[
      this.state.fontFamilies.findIndex((font) => {
        return font.label === name;
      })
    ];
  }

  getCategoryItem(id) {
    return this.state.categories[
      this.state.categories.findIndex((category) => {
        return category.id === id;
      })
    ];
  }

  handleEditItem = async (id) => {
    const item = this.getItemById(id);
    await this.setAsyncState({
      itemEditId: id,
      templateEditId: item.templateUsed
    });

    if(item.templateUsed) {
      this.setState({
        showConfirmEditModal: true
      })
    } else {
      await this.setAsyncState({
        boxEditorProps: {
          item,
        },
        showEditMenu: !this.state.showEditMenu,
        pageTransitionPadding: "300px",
      });
    }
  };

  handleDiscard = () => {
    this.setState({ showDiscardModal: true });
  };

  handleModuleOptions = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  // for speed dial
  handleSpeedDialClose = () => {
    this.setState({ speedDialState: false });
  };

  handleSpeedDialOpen = () => {
    this.setState({ speedDialState: true });
  };

  handleBoxSpacing = async (event, newValue) => {
    if (this.state.config.layoutBoxSpacing[0] !== newValue) {
      this.setState({
        config: JSON.parse(`{
          "layoutBoxSpacing": [${newValue}, ${newValue}],
          "layoutBoxPadding": {
            "lg": [0, 0],
            "md": [0, 0],
            "sm": [0, 0],
            "xs": [0, 0],
            "xxs": [0, 0]
          }
        }`),
      });
    }
  };

  handleItemModule = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
    await this.setAsyncState({
      editItemModule: this.getModuleIndex(newValue.label),
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

  handleBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));

      this.setState({
        pageBase64Image: strings[0],
        backgroundImageFile: event[0],
      });
    }
  };

  handleBackgroundDelete() {
    this.setState({
      pageBase64Image: "",
      backgroundImageFile: "",
    });
  }

  // for MuiThemeProvider

  createDefaultTheme = () => {
    return createTheme({
      palette: this.props.defaultTheme,

      overrides: {
        MuiSpeedDial: {
          actionsClosed: {
            height: "0",
            oveflow: "hidden",
          },
          fab: {
            backgroundColor: "white",
            color: "black",
            "&:hover": {
              backgroundColor: "white",
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
            // width: "90%",
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
            margin: "0 !important",
          },
        },
        MuiDropzonePreviewList: {
          root: {
            margin: "0 !important",
          },
          image: {
            height: "auto !important",
          },
          imageContainer: {
            padding: "0 !important",
            width: "100% !important",
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
      },
    });
  };

  handleFontSize = (event, newValue) => {
    if (this.state.fontSize !== newValue) {
      this.setState({ fontSize: newValue });
    }
  };

  handleFontFamily = async (event, newValue) => {
    await this.setAsyncState({
      fontFamily: newValue.label,
    });
  };
  handleTemplateChange = async (event, newValue) => {
    await this.setAsyncState({
      template: newValue || {},
    });
    if (newValue) {
      await this.fetchAndSet(newValue?.id, true);
    } else {
      await this.setAsyncState({
        items: [],
        pageConfig: null,
        editPage: null
      })
    }
  };

  handleCategory = async (event, category) => {

    await this.setAsyncState({
      categoryId: category.id
    });

    if(category.id) {
      await this.setAsyncState({
        currentCategory: this.getCategoryItem(category.id)
      });
    }

    if (!category.id) {
      this.setState({
        openNewCategory: true,
        dialogValue: {
          title: category.value,
        },
      });
    }
  };

  getCategoriesNested(id) {
    let link = this.state.categories.find((el) => el.id === id);
    let result = link.label || "";
    if (link && link.parentid) {
      result = this.getCategoriesNested(link.parentid) + "/" + result;
    }
    return result;
  }

  getAllCategories = async () => {
    let result = [];

    if (this.state.categories.length) {
      let links = this.state.categories;
      links.map((el) => {
        let linkName = el.label;
        if (el.parentid) {
          linkName = this.getCategoriesNested(el.parentid) + "/" + el.label;
        }
        result.push({
          id: el.id,
          label: linkName,
        });
        return el;
      });

      await this.setAsyncState({
        flatCategories: result,
      });
    }
  };

  sendStyles = (targetedColor) => {
    return reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: targetedColor
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
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
    if (!this.state[styles]) {
      return;
    }

    let pickerColor = Object.assign({}, this.state[styles].color);

    pickerColor.background = this.state[targetedColor];

    return (
      <div>
        <div
          style={this.state[styles].swatch}
          onClick={() => this.handleClick(displayColorPicker)}
        >
          <div style={pickerColor} />
        </div>
        {this.state[displayColorPicker] ? (
          <div style={this.state[styles].popover}>
            <div
              style={this.state[styles].cover}
              onClick={() => this.handleColorPickerClose(displayColorPicker)}
            />
            <SketchPicker
              color={this.state[targetedColor]}
              onChange={(color) => {
                this.setState({
                  [targetedColor]: color.hex,
                });
              }}
            />
          </div>
        ) : null}
      </div>
    );
  };

  createGradientColorPicker = (styles, displayColorPicker, targetedColor) => {
    if (!this.state[styles]) {
      return;
    }

    let pickerColor = Object.assign({}, this.state[styles].color);

    pickerColor.background = this.state[targetedColor];

    return (
        <div>
          <div
              style={this.state[styles].swatch}
              onClick={() => this.handleClick(displayColorPicker)}
          >
            <div style={pickerColor} />
          </div>
        </div>
    );
  };

  savePage = async () => {
    let pageConfig = this.preparePageConfiguration();

    if (this.state.editing) {
      let page = {
        id: this.state.page_id,
        pageConfig: pageConfig,
        items: this.state.items,
      };
      await this.props.control.edit({ ...page, editPage: this.state.editPage });

      this.setState({
        showSavedMessage: true
      });

      setTimeout(() => {
        this.setState({
          showSavedMessage: false
        })
      }, 3000);

    } else {
      let newPage = {
        pageConfig: pageConfig,
        items: this.state.items,
      };
      const pagedata = await this.props.control.add(newPage);

      this.props.history.push(`/pages/edit/${pagedata.pageId}`);

    }
  };

  handleCategoryUniqueness = async (event) => {
    if(!event?.target?.value?.length) {
      return null;
    }
    let categoriesFromStorage = await this.props.control.listCategories({
      where: {
        title: event.target.value
      }
    });
    this.setState({
      isUniqueTitle: !categoriesFromStorage?.length
    });
  };

  handleNewCategory = async (event) => {
    event.preventDefault();
    event.persist();
    const newTitle = `${this.state.dialogValue.title}`;
    const newDescription = `${this.state.dialogValue.title}`;

    let categoriesFromStorage = await this.props.control.listCategories({
      where: {
        title: this.state.dialogValue.title
      }
    });

    if(!categoriesFromStorage?.length) {
      const newCategory = await this.props.control.addCategory({
        title: newTitle,
        description: newDescription,
      });

      categoriesFromStorage = await this.props.control.listCategories();

      const categories = [];

      categoriesFromStorage.map((category) => {
        categories.push({
          label: category.title,
          id: category.id,
          parentid: category.parentid,
        });
        return category;
      });
      await this.setAsyncState({ categories });

      await this.getAllCategories();

      this.setState({
        categoryId: newCategory.categoryId,
        currentCategory: this.getCategoryItem(newCategory.categoryId)
      });
    } else {
      await this.getAllCategories();
    }

    this.setState({
      openNewCategory: false
    })
  };

  render() {

    const bodyWrapperStyle = {};
    let hasBgImage = false;

    if(this.state.bgColor) {
      bodyWrapperStyle.backgroundColor = this.state.bgColor;
      bodyWrapperStyle.backgroundImage = 'none';
    }

    if(this.state.pageBackgroundGradient) {
      bodyWrapperStyle.backgroundImage = this.state.bgGradientColor;
      hasBgImage = true;
    } else {
      if(this.state.pageBase64Image || this.state.backgroundImage) {
        bodyWrapperStyle.backgroundImage = `url(${ this.state.pageBase64Image || `/files/pages/page-${this.state.page_id}/${this.state.backgroundImage})` }`;
        hasBgImage = true;
      }
    }

    if(hasBgImage) {
      bodyWrapperStyle.backgroundPosition = "center";
      if(this.state.pageBackgroundRepeat) {
        bodyWrapperStyle.backgroundRepeat = "repeat";
      } else {
        bodyWrapperStyle.backgroundRepeat = "no-repeat";
      }

      if(this.state.pageBackgroundStretch) {
        bodyWrapperStyle.backgroundSize = "cover"
      } else {
        bodyWrapperStyle.backgroundSize = "auto"
      }
    }

    const pageActions = [
      {
        callback: () => {
          this.openPageOptionsModal()
        },
        icon: <Settings
            className={this.props.classes.rightSideIcon}
            color="primary"
        />,
        name: "Page options",
      },
      {
        callback: () => {
          window.open(
              `/pages/preview/${this.state.page_id}`
          );
        },
        icon: <Visibility
            className={this.props.classes.rightSideIcon}
            color="primary"
        />,
        name: "Preview page"
      },
      {
        callback: (evt) => {
          this.onAddItem(evt)
        },
        icon: <AddCircle
            className={this.props.classes.rightSideIcon}
            color="primary"
        />,
        name: "Add box",
      },
      {
        callback: async () => {
          await this.setAsyncState(prevState => ({
            livePreview: !prevState.livePreview
          }))
        },
        icon: this.state.livePreview ? <StopScreenShare
            className={this.props.classes.rightSideIcon}
            color="primary"
        /> : <ScreenShare
            className={this.props.classes.rightSideIcon}
            color="primary"
        />,
        name: this.state.livePreview ? "Stop Live Preview Mode" : "Turn on Live Preview Mode",
      }
    ];
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.state.editing ? "Edit Page" : "Add Page"}</title>
        </Helmet>
        <div
          className={this.props.classes.bodyWrapper}
          style={{
            marginTop: "60px",
            paddingBottom: "130px",
            paddingLeft: this.state.pageTransitionPadding,
            ...bodyWrapperStyle
          }}
        >
          <MuiThemeProvider theme={this.muiTheme}>
            {this.state.showEditMenu && (
              <ViewBoxEditor
                onCancel={() => {
                  this.setState({
                    showEditMenu: false,
                    pageTransitionPadding: "",
                  });
                }}
                onSave={(item) => {
                  this.setState({
                    editItem: item,
                    showEditMenu: false,
                    pageTransitionPadding: "",
                  });
                }}
                defaultTheme={this.props.defaultTheme}
                data={this.state.boxEditorProps}
              />
            )}
            <Dialog
                open={this.state.showPageOptionsModal}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="page-options-modal-slide-title"
                aria-describedby="page-options-modal-slide-description"
                classes={{
                  root: this.props.classes.center,
                  paper: this.props.classes.modalPageOptions
                }}
            >
              <DialogTitle
                  id="page-options-modal-slide-title"
                  disableTypography
                  className={this.props.classes.modalHeader}
              >
                <h4 className={this.props.classes.modalTitle}>
                  Page options
                </h4>
              </DialogTitle>
              <DialogContent
                  id="page-options-modal-slide-description"
                  className={this.props.classes.modalBodyPageOptions}
              >
                <div className={this.props.classes.pageTitleInputWrapper}>
                  <CustomInput
                      labelText={this.state.isTemplate ? "Template Title" : "Page Title"}
                      id="pageTitle"
                      required="required"
                      formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                      }}
                      inputProps={{
                        inputProps: {
                          minLength: "1"
                        },
                        value: this.state.pageTitle,
                        type: "text",
                      }}
                  />{" "}
                  {!this.state.isTemplate && <CustomInput
                      labelText="Page Link"
                      id="pageLink"
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
                        value: this.state.pageLink,
                        type: "text",
                      }}
                  />}
                </div>
                <div className={this.props.classes.pageOptionsDetails}>
                  <div
                      className={
                        this.props.classes.column +
                        " " +
                        this.props.classes.columnSeparator
                      }
                  >
                    <h4>Background</h4>
                    <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                    >
                      <div style={{ display: "block" }}>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                        >
                          <h5 style={{ marginRight: "15px" }}>Color</h5>

                          <Tooltip title="Compose a background gradient instead of a solid color">
                            {this.createColorPicker(
                                "bgColorStyles",
                                "showBgColorPicker",
                                "bgColor"
                            )}
                          </Tooltip>
                        </div>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                        >
                          <h5 style={{ marginRight: "15px" }}>Gradient</h5>

                          <Tooltip title="Compose a background gradient instead of a solid color">
                            {this.createGradientColorPicker(
                                "bgColorStyles",
                                "showBgGradientColorPickerModal",
                                "bgGradientColor"
                            )}
                          </Tooltip>
                        </div>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                        >
                          <Typography gutterBottom>
                            Gradient
                            <Tooltip title="Compose a background gradient instead of a solid color">
                              <Switch
                                  value={this.state.pageBackgroundGradient}
                                  checked={this.state.pageBackgroundGradient}
                                  onChange={() => {
                                    this.setState({
                                      pageBackgroundGradient: !this.state
                                          .pageBackgroundGradient,
                                    });
                                  }}
                              />
                            </Tooltip>
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                        >
                          <Typography gutterBottom>
                            Repeat
                            <Tooltip title="Repeat the background to fit the page">
                              <Switch
                                  value={this.state.pageBackgroundRepeat}
                                  checked={this.state.pageBackgroundRepeat}
                                  onChange={() => {
                                    this.setState({
                                      pageBackgroundRepeat: !this.state
                                          .pageBackgroundRepeat,
                                    });
                                  }}
                              />
                            </Tooltip>
                          </Typography>
                        </div>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                        >
                          <Typography gutterBottom>
                            Stretch
                            <Tooltip title="Stretch the background to fit the page">
                              <Switch
                                  checked={this.state.pageBackgroundStretch}
                                  value={this.state.pageBackgroundStretch}
                                  onChange={() => {
                                    this.setState({
                                      pageBackgroundStretch: !this.state
                                          .pageBackgroundStretch,
                                    });
                                  }}
                              />
                            </Tooltip>
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                    >
                      <h5>Background Image</h5>
                      {(this.state.backgroundImage ||
                          this.state.pageBase64Image) && (
                          <Tooltip title="Delete background image">
                            <DeleteForever
                                onClick={() =>
                                    this.setState({
                                      backgroundImage: "",
                                      backgroundImageFile: "",
                                    })
                                }
                                style={{
                                  color: this.props.defaultTheme.secondary.main,
                                }}
                            />
                          </Tooltip>
                      )}
                    </div>
                    <div className={this.props.classes.dropzoneAreaWrapper}>
                      <DropzoneArea
                          filesLimit={1}
                          onChange={this.handleBgImage.bind(this)}
                          onDelete={this.handleBackgroundDelete.bind(this)}
                      />
                    </div>
                  </div>
                  <p />
                  <div
                      className={
                        this.props.classes.column +
                        " " +
                        this.props.classes.columnSeparator
                      }
                  >
                    <h4>Font </h4>
                    <div style={{ marginTop: "15px" }}>
                      <Autocomplete
                          id="fontFamilyDropdown"
                          onChange={this.handleFontFamily}
                          className={this.props.classes.option}
                          options={this.state.fontFamilies}
                          autoHighlight
                          getOptionLabel={(option) => option.label}
                          value={this.getFontFamilyItem(
                              this.state.fontFamily
                          )}
                          renderInput={(params) => (
                              <TextField
                                  className={this.props.classes.textfield}
                                  {...params}
                                  label="Select a Font Family"
                                  variant="outlined"
                              />
                          )}
                      />
                      <Typography gutterBottom>Font Size</Typography>
                      <Slider
                          className={this.props.classes.pageOptionsSlider}
                          onChange={(event, newValue) => {
                            this.handleFontSize(event, newValue);
                          }}
                          value={this.state.fontSize}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          min={5}
                          max={50}
                      />
                    </div>
                    <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                    >
                      <h5>Text Color</h5>
                      {this.createColorPicker(
                          "textColorStyles",
                          "showTextColorPicker",
                          "textColor"
                      )}
                    </div>
                  </div>
                  <p />
                  <div
                      className={clsx(
                          this.props.classes.column,
                          this.props.classes.helper
                      )}
                  >
                    <h4>Miscellaneous</h4>
                    <div style={{ marginTop: "15px" }}>
                      {!this.state.isTemplate &&
                      <div>
                        <Autocomplete
                            id="categoryDropdown"
                            onChange={this.handleCategory}
                            onInputChange={this.handleCategoryUniqueness}
                            className={this.props.classes.option}
                            value={this.state.currentCategory}
                            filterOptions={(options, params) => {
                              const filtered = filter(options, params);
                              if (
                                  params.inputValue !== "" &&
                                  this.state.isUniqueTitle
                              ) {
                                filtered.push({
                                  value: params.inputValue,
                                  label: `Add "${params.inputValue}"`,
                                });
                              }
                              return filtered;
                            }}
                            options={this.state.flatCategories}
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField
                                    className={this.props.classes.textfield}
                                    label="Select a category"
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                        />

                        <Dialog
                            open={this.state.openNewCategory}
                            onClose={() =>
                                this.setState({
                                  dialogValue: {
                                    title: "",
                                    description: "",
                                  },
                                  openNewCategory: false,
                                })
                            }
                            aria-labelledby="form-dialog-title"
                        >
                          <form onSubmit={this.handleNewCategory}>
                            <DialogTitle
                                style={{ textAlign: "center" }}
                                id="form-dialog-title"
                            >
                              Add a new category
                            </DialogTitle>
                            <DialogContent
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                            >
                              <TextField
                                  autoFocus
                                  disabled
                                  margin="dense"
                                  id="title"
                                  value={this.state.dialogValue.title}
                                  label="title"
                                  type="text"
                              />

                              <TextField
                                  autoFocus
                                  margin="dense"
                                  id="description"
                                  value={this.state.dialogValue.description}
                                  onChange={(event) =>
                                      this.setState({
                                        dialogValue: {
                                          ...this.state.dialogValue,
                                          description: event.target.value,
                                        },
                                      })
                                  }
                                  label="description"
                                  type="text"
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button type="submit" color="primary">
                                Add
                              </Button>
                              <Button
                                  onClick={() =>
                                      this.setState({
                                        dialogValue: {
                                          title: "",
                                          description: "",
                                        },
                                        openNewCategory: false,
                                      })
                                  }
                                  style={{color: this.props.defaultTheme.secondary.main}}
                              >
                                Cancel
                              </Button>

                            </DialogActions>
                            {this.state.dialogErr && (
                                <p
                                    style={{
                                      textAlign: "center",
                                      color: "red",
                                    }}
                                >
                                  Category Already Exist Please Check again
                                </p>
                            )}
                          </form>
                        </Dialog>
                      </div>}
                      { !this.state.isTemplate &&
                      (!this.state.editing ? (
                          <div>
                            <Autocomplete
                                id="templateDropdown"
                                onChange={this.handleTemplateChange}
                                disabled={this.state.editing}
                                className={this.props.classes.option}
                                options={this.state.templates}
                                autoHighlight
                                getOptionLabel={(option) => option.label}
                                // value={this.state.template}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        label="Select a template"
                                        variant="outlined"
                                    />
                                )}
                            />
                          </div>
                      ) : (
                          <div style={{marginBottom: "15px"}}>
                            Template used:{" "}
                            <strong>
                              {this.state.template?.label || "none"}
                            </strong>
                          </div>
                      ))
                      }
                      <Typography gutterBottom>Box Spacing</Typography>
                      <Slider
                          className={this.props.classes.pageOptionsSlider}
                          onChange={this.handleBoxSpacing}
                          value={this.state.config.layoutBoxSpacing[0]}
                          getAriaValueText={() =>
                              this.state.config.layoutBoxSpacing[0] + " pixels"
                          }
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          min={0}
                          max={150}
                      />
                      {!this.state.isTemplate &&
                      <>
                        <div>
                          <Typography
                              gutterBottom
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                          >
                            <span>Publish</span>
                            <Tooltip title="Enable Publishing">
                              <Switch
                                  checked={this.state.publish}
                                  value={this.state.publish}
                                  onChange={() => {
                                    this.setState({
                                      publish: !this.state.publish,
                                    });
                                  }}
                              />
                            </Tooltip>
                          </Typography>
                        </div>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                        >
                          <Typography gutterBottom>Default Page</Typography>
                          <Tooltip title="Set as default page">
                            <Switch
                                checked={this.state.defaultPage}
                                value={true}
                                onChange={() => {
                                  this.setState({
                                    defaultPage: !this.state.defaultPage,
                                  });
                                }}
                            />
                          </Tooltip>
                        </div>
                      </>}
                      <div style={{ marginLeft: "-10px" }}>
                        <Checkbox
                            checked={this.state.isTemplate}
                            disabled={this.props.location.state && this.props.location.state.templateMode}
                            onChange={(event, checked) => {
                              this.setState({
                                isTemplate: checked,
                              });
                            }}
                        />
                        <span>Save as template</span>
                      </div>
                    </div>
                  </div>
                </div>

              </DialogContent>

              <DialogActions className={this.props.classes.modalFooter}>
                <Button
                    color="primary"
                    simple
                    onClick={() => {
                      this.closePageOptionsModal();
                    }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.showDiscardModal}
              TransitionComponent={this.transition}
              keepMounted
              onClose={() => this.closeDiscardModal()}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
              classes={{
                root: this.props.classes.center,
                paper: this.props.classes.modal,
              }}
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={this.props.classes.modalHeader}
              >
                <h4 className={this.props.classes.modalTitle}>
                  {this.state.modalTitle}
                </h4>
              </DialogTitle>
              <DialogContent
                id="classic-modal-slide-description"
                className={this.props.classes.modalBody}
              >
                <div>Are you sure you want to proceed ?</div>
              </DialogContent>

              <DialogActions className={this.props.classes.modalFooter}>
                <Button
                  color="transparent"
                  simple
                  onClick={() => this.props.history.push("/pages")}
                >
                  <div>Proceed</div>
                </Button>
                <Button
                  color="danger"
                  simple
                  onClick={() => {
                    this.closeDiscardModal();
                  }}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <div className={this.props.classes.gridLayout}>
              <div
                  style={{
                    flexGrow: 1,

                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.textColor,
                    paddingBottom: "55px",
                  }}
              >
                {this.state.livePreview
                    ? <ViewPagesPreview isLivePreview={true} control={this.props.control} {...{items: this.state.items, pageConfig: this.preparePageConfiguration()}} />
                    :
                <ResponsiveReactGridLayout
                    style={{
                      fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                      fontFamily: this.state.fontFamily,
                      color: this.state.textColor,
                    }}
                    layouts={this.state.layouts}
                    isBounded={true}
                    margin={this.state.config.layoutBoxSpacing}
                    containerPadding={this.state.config.layoutBoxPadding}
                    draggableHandle=".MyDragHandleClassName"
                    onLayoutChange={(layout, layouts) => {
                      return this.onLayoutChange(layout, layouts);
                    }}
                    compactType="vertical"
                    onBreakpointChange={() => this.onBreakpointChange}
                    {...this.props}
                >
                  {_.map(this.state.items, (el) => this.createElement(el))}
                </ResponsiveReactGridLayout>}
                <div className={this.props.classes.bottomPane} style={{
                  backgroundColor: this.props.defaultTheme.background.paper
                }}>
                    <div>
                        <MoreMenu icon="arrowHorizontal" direction="right" itemActions={pageActions}/>
                    </div>
                    <div className={this.props.classes.bottomPaneButtons}>
                        <Button
                            disabled={this.state.pageTitle.length === 0}
                            onClick={async () => {
                                await this.savePage();
                            }}
                            color="primary"
                        >
                          <div>Save</div>
                        </Button>
                        <Button onClick={() => this.handleDiscard()} color="danger">
                          Discard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
            <Modal
                showModal={this.state.showBgGradientColorPickerModal}
                {...this.state.bgGradientColorPickerModal}
            />
            <Modal
                showModal={this.state.showConfirmEditModal}
                {...this.state.confirmEditModal}
            />
            <Modal
                showModal={this.state.showConfirmDeleteModal}
                {...this.state.confirmDeleteModal}
            />
            <Snackbar
                open={this.state.showSavedMessage}
                place="tc"
                color="success"
                icon={InfoSharp}
                message="The page was updated successfully"
            />
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(ViewPagesEditor));

ViewPagesEditor.propTypes = {
  classes: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  control: PropTypes.object,
  defaultTheme: PropTypes.object
};