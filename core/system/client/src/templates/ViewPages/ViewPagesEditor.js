import React, {Suspense} from "react";
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
  InfoSharp, ScreenShare, StopScreenShare, PostAdd,ErrorSharp, FileCopy
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { Responsive, WidthProvider } from "react-grid-layout";
import GradientPicker from "components/GradientColorPicker/GradientColorPicker";
import { withRouter } from "react-router-dom";
import Snackbar from "components/Snackbar/Snackbar.js";
import imageHelper from "helpers/image.helper";


import { Helmet } from "react-helmet";

// for the modal
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import fontsList from "../../config/google_fonts.js";
import GoogleFontLoader from 'react-google-font-loader';

// for the styling side-menu

// for accordion

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

import Modal from "../../components/Modal/Modal";
import ViewPagesPreview from "./ViewPagesPreview";
import PropTypes from "prop-types";
import ViewBoxesFromTemplate from "./ViewBoxesFromTemplate";
import ViewPageOptions from "./ViewPageOptions";
import Typography from "@material-ui/core/Typography";
import ViewBoxOptions from "./ViewBoxOptions";
import Avatar from "@material-ui/core/Avatar";
import * as shortId from "shortid";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewPagesEditor extends React.PureComponent {

  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 1,
    transformScale: 1,
  };

  state = {
    page_id: 0,
    configStates: {
      showBackgroundColor: false,
    },
    showDiscardModal: false,
    showSavedMessage: false,
    showErrorMessage: false,
    errorMessage: "",
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
    showBoxOptions: false,
    itemEditId: "",
    itemModuleEditId: "",
    fontFamilies: fontsList,
    bgColor: "#FFF",
    bgGradientColor:"",
    pageBase64Image: false,
    backgroundImage: "",
    backgroundImageFile: "",
    fontSize: 1,
    textColor: "#000000",
    fontFamily: "Roboto",
    pageTitle: "",
    pageLink: "",
    pageMetaTitle: "",
    pageMetaDescription: "",
    useWebsiteTitle: false,
    useDefaultFavicon: true,
    pageFavicon: "",
    websiteInfo: false,
    showBgColorPicker: false,
    showBgGradientColorPickerModal: false,
    showTextColorPicker: false,
    showItemTextColorPicker: false,
    publish: false,
    pageBackgroundColor: false,
    pageBackgroundImage: false,
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
      content: <GradientPicker selectColor={
        (color) => this.setState({
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
          this.setState((prevState) => {
            return {
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
      content: <div>This box is from a template. Do you want to open it in a new tab so you can edit it?</div>,
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
    showConfirmDeleteBoxModal: false,
    confirmDeleteBoxModal: {
      name: "confirmDeleteBoxModal",
      title: "Confirm Delete Box",
      itemId: "",
      content: <div>Are you sure you want to delete this box?</div>,
      modalSize: "small",
      closeButton: {
        callback: () => {
          this.setState({ showConfirmDeleteBoxModal: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.setState({ showConfirmDeleteBoxModal: false });
          this.onRemoveItem(this.state.confirmDeleteBoxModal.itemId);
        },
        label: "Delete",
      },
    },
    showConfirmDeleteModal: false,
    confirmDeleteModal: {
      name: "confirmDeleteModal",
      title: "Confirm Delete",
      itemId: "",
      content: <div>This box is from a template. Are you sure you want to delete it?</div>,
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
    showBoxesFromTemplate: false,
    boxesFromTemplate: {
      name: "boxesFromTemplate",
      title: "Select Box From a Template",
      content: <ViewBoxesFromTemplate {...this.props} updateBoxList={(boxes) => this.updateBoxList(boxes)} />,
      closeButton: {
        callback: () => {
          this.setState({ showBoxesFromTemplate: false });
        },
        label: "Cancel",
      },
      confirmButton: {
        show: false,
        callback: async () => {
          if(this.state.newBoxList && this.state.newBoxList.length > 0) {
            this.setState({ showBoxesFromTemplate: false });
            const items = [...this.state.items];
            await this.setAsyncState({
              items: [...items, ...this.state.newBoxList]
            })
          } else {
            this.setState({
              showErrorMessage: true,
              errorMessage: "Please Select Box First!"
            });

            setTimeout(() => {
              this.setState({
                showErrorMessage: false,
                errorMessage: ""
              })
            }, 3000);
          }
        },
        label: "Add",
      },
    },
    googleFonts: []
  };





  setUsedGoogleFonts() {
    const fonts = [];

    if(this.state.fontFamily && this.state.fontFamily.length) {
      fonts.push({font: this.state.fontFamily});
    }

    if(this.state.items && this.state.items.length) {
      this.state.items.map((item) => {
        if(item.fontFamily && !fonts.some(f => f.font === item.fontFamily)) {
          fonts.push({font: item.fontFamily});
        }
        return item;
      });
    }
    this.setState({
      googleFonts: fonts
    })
  }

  async updateBoxList(boxes) {
    await this.setAsyncState({
      newBoxList: boxes
    })
  }

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
        pageMetaTitle: JSON.parse(pageConfig.data).pageMetaTitle,
        pageMetaDescription: JSON.parse(pageConfig.data).pageMetaDescription,
        useWebsiteTitle: JSON.parse(pageConfig.data).useWebsiteTitle,
        useDefaultFavicon: JSON.parse(pageConfig.data).useDefaultFavicon,
        pageFavicon: JSON.parse(pageConfig.data).pageFavicon,
        websiteInfo: JSON.parse(pageConfig.data).websiteInfo,
        defaultConfig: savedLayoutBoxSpacing,
        config: savedLayoutBoxSpacing,
        categoryId: pageConfig.categoryId,
        currentCategory: this.getCategoryItem(pageConfig.categoryId),
        defaultPage: pageConfig.defaultPage,
        publish: pageConfig.publish,
        pageBackgroundImage: !!pageConfig.backgroundImage?.length,
        pageBackgroundRepeat: pageConfig.backgroundRepeat,
        pageBackgroundStretch: pageConfig.backgroundStretch,
        pageBackgroundGradient: pageConfig.backgroundGradient,
        pageBackgroundColor: pageConfig.backgroundColor,
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

    this.setUsedGoogleFonts();

  }

  getWebsiteData = async () => {
    return (await this.props.control.websiteData())
  }

  async componentDidMount() {
    let editing = this.state.editing;
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

    let categories = [];

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
          this.setState({ bgColor: defaultPublicTheme.bgcolor, pageBackgroundColor: true });
        }
        if (defaultPublicTheme.bgimage?.length) {
          this.setState({ backgroundImage: defaultPublicTheme.bgimage, pageBackgroundImage: true });
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
        if (defaultPublicTheme.textcolor) {
          this.setState({ textColor: defaultPublicTheme.textcolor });
        }
        if (defaultPublicTheme.fontfamily) {
          this.setState({ fontFamily: defaultPublicTheme.fontfamily });
        }
      }

      if(this.props.location?.state?.templateMode) {
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

    const payload = {
      backgroundColor: this.state.bgColor,
      backgroundGradientColor: this.state.bgGradientColor,
      backgroundImage: this.state.pageBackgroundImage ? this.state.backgroundImage : "",
      oldBackgroundImage: this.state.oldBackgroundImage,
      backgroundImageFile: this.state.backgroundImageFile,
      fontSize: this.state.fontSize,
      textColor: this.state.textColor,
      fontFamily: this.state.fontFamily,
      layoutBoxSpacing: this.state.config.layoutBoxSpacing,
      pageTitle: this.state.pageTitle,
      pageLink: this.state.pageLink,
      pageMetaTitle: this.state.pageMetaTitle,
      pageMetaDescription: this.state.pageMetaDescription,
      useWebsiteTitle: this.state.useWebsiteTitle,
      useDefaultFavicon: this.state.useDefaultFavicon,
      pageFavicon: this.state.pageFavicon,
      websiteInfo: this.state.websiteInfo,
      publish: this.state.publish,
      backgroundRepeat: this.state.pageBackgroundRepeat,
      backgroundStretch: this.state.pageBackgroundStretch,
      backgroundGradient: this.state.backgroundGradient,
      defaultPage: this.state.defaultPage,
      categoryId: this.state.categoryId,
      isTemplate: this.state.isTemplate,
      templateUsed: this.state.template?.label,
    };

    payload.data = JSON.stringify(_.cloneDeep(payload));


    return payload;
  }

  createElement(el) {
    const i = el.i;

    let itemStyle = {};

    if (el.showScrollbars) {
      itemStyle.showScrollbars = el.showScrollbars;
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

    if (el.backgroundImage && el.backgroundImage.indexOf("__delete__") === 0) {
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

    let style = {};

    if (el.backgroundImage) {
      style.backgroundImage = `url(/files/pages/page-${el.templateUsed ? el.templateUsed : this.state.page_id}/box-${i}/${el.backgroundImage})`;
    }

    if (el.backgroundRepeat) {
      style.backgroundRepeat = el.backgroundRepeat ? "repeat" : "no-repeat";
    }

    if (el.backgroundStretch) {
      style.backgroundSize = el.backgroundStretch ? "cover" : "auto";
    }

    if (el.backgroundGradient) {
      style.backgroundImage = el.backgroundGradientColor;
    }

    if (el.backgroundColor) {
      style.backgroundColor = el.backgroundColor;
    }

    if (el.borderColor) {
      style.borderColor = el.borderColor;
    }

    if (el.borderWidth) {
      style.borderStyle = "solid";
      style.borderWidth = el.borderWidth + "px";
    }

    if (el.borderRadius) {
      style.borderRadius = el.borderRadius;
    }

    if (Number(el.fontSize)) {
      style.fontSize = `${el.fontSize}${this.state.fontUnit}`;
      style.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
    } else if (this.state.pageConfig?.fontSize) {
      style.fontSize = `${this.state.pageConfig.fontSize}${this.state.fontUnit}`;
      style.lineHeight = `${this.state.pageConfig.fontSize}${this.state.fontUnit}`;
    }

    if (el.fontFamily) {
      style.fontFamily = el.fontFamily;
    } else if (this.state.pageConfig?.fontFamily) {
      style.fontFamily = this.state.pageConfig.fontFamily;
    }

    if (el.textColor) {
      style.color = el.textColor;
    } else if (this.state.pageConfig?.textColor) {
      style.textColor = this.state.pageConfig.textColor;
    }

    if (el.showScrollbars) {
      style.overflow = "auto";
    } else {
      style.overflow = "hidden";
    }

    let LazyModule;
    const loadingFallback = (() => {
      return <span>Loading...</span>;
    })();

    LazyModule = false;



    if (el.module) {
      const moduleType = el.module.replaceAll(" ", "");
      LazyModule = React.lazy(() => import(`./box/previews/${moduleType}`));
    }

    const classes = this.props.classes;
    return (
        <div key={i} data-grid={el} style={itemStyle}>
          <div className={classes.boxControls}>
            <div style={{ color: "black", verticalAlign: "middle" }}>
              <Tooltip title="Drag Box">
                <IconButton className="MyDragHandleClassName" color="primary">
                  <OpenWith color="primary" />
                </IconButton>
              </Tooltip>
              <div className={classes.renderBoxTitle}>
                <h1>{el.title}</h1>
              </div>
            </div>
            <div className={classes.editorButtonWrapper}>
              <Tooltip title="Show box properties">
                <IconButton onClick={() => { this.handleBoxOptions(i) }}>
                  <Avatar style={{backgroundColor: this.props.defaultTheme.secondary.main, color: this.props.defaultTheme.secondary.contrastText}}>
                    <Edit />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Tooltip title="Make a copy of this box">
                <IconButton onClick={() => { this.onDuplicate(el.i) }}>
                  <Avatar style={{backgroundColor: this.props?.defaultTheme?.primary?.main, color: this.props?.defaultTheme?.primary?.contrastText}}>
                    <FileCopy/>
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete this box">
                <IconButton onClick={async () => {
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
                  this.setState((prevState) => {
                    return {
                      showConfirmDeleteBoxModal: true,
                      confirmDeleteBoxModal: {
                        ...prevState.confirmDeleteBoxModal,
                        itemId: el.i
                      }
                    }
                  });
                }}>
                  <Avatar style={{backgroundColor: this.props.defaultTheme.error.main, color: this.props.defaultTheme.error.contrastText}}>
                    <DeleteForever />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className={classes.boxLazyModuleWrapper}>
            {el.module && LazyModule ? (
                <Suspense fallback={loadingFallback}>
                  <LazyModule
                      control={this.props.control}
                      style={{style}}
                      element={{moduleOptions: el.moduleOptions, id: el.id}}
                      defaultTheme={this.props.defaultTheme}
                      onStartEditingModule={() => this.onStartEditingModule()}
                      onEndEditingModule={() => this.onEndEditingModule()}
                      boxId={el.i}
                      moduleOptions={el.moduleOptions}
                      pageOptions={{
                        page_id: this.state.page_id
                      }}
                      pageId={this.state.page_id}
                      handleSave={async (id, data) => {
                        await this.saveModuleOptions(id, data);
                      }}
                      services={this.props.services}
                  />
                </Suspense>
            ) : (
                ""
            )}
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

  toBase64(file) {//TODO MOVE TO HELPERS
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  async onDuplicate(id) {
    try {
      const existingItem = this.getItemById(id);

      let newId = 0;

      this.state.items.map((item) => {
        newId = Number(item.i) > Number(newId) ? Number(item.i) : newId;
        return item;
      });

      newId++;
      let items = this.state.items;

      const targetItem = Object.assign({}, existingItem);
      targetItem.i = newId + "";
      targetItem.x = 0;
      targetItem.y = Infinity;

      if(!targetItem.backgroundImageFile && existingItem.backgroundImage) {
        const bgResponse = await fetch(`/files/pages/page-${existingItem.templateUsed ? existingItem.templateUsed : this.state.page_id}/box-${id}/${existingItem.backgroundImage}`);
        const bgBlob = await bgResponse.blob();
        targetItem.backgroundImageFile = new File([bgBlob], existingItem.backgroundImage);
        targetItem.backgroundImageString = await Promise.all([imageHelper.toBase64(targetItem.backgroundImageFile)]);
      }

      items.push(targetItem);

      await this.setAsyncState({
        items: items
      });
      await this.setAsyncState({
        addAnItem: !this.state.addAnItem
      });
      window.scrollTo(0,document.body.scrollHeight);
    } catch (err) {
      console.log(err);
    }
  }

  async onAddItem() {
    let newId = 0;
    this.setState({
      boxEditorProps: {},
      addAnItem: !this.state.addAnItem
    });
    try {
      this.state.items.map((item) => {
        newId = Number(item.i) > Number(newId) ? Number(item.i) : newId;
        return item;
      });

      newId++;

      //let items = this.state.items;
      const item = {
        newItem: true,
        title: "New Box",
        showScrollbars: false,
        module: "",
        moduleOptions: { data: "" },
        borderColor: "#959595",
        borderStyle: "solid",
        borderWidth: 0,
        borderRadius: 0,
        backgroundImage: "",
        backgroundImageFile: "",
        backgroundRepeat: false,
        backgroundStretch: false,
        i: String(newId),
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 12,
        h: 20,
      };


      await this.setAsyncState({
        boxEditorProps: {
          item
        }
      });

      await this.setAsyncState({
        showBoxOptions: true
      });

      window.scrollTo(0,document.body.scrollHeight);
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
        oldItem.x = item.x;
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

  getCategoryItem(id) {
    return this.state.categories[
        this.state.categories.findIndex((category) => {
          return category.id === id;
        })
        ];
  }

  handleBoxOptions = async (id) => {
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
        }
      });
      this.setState({
        showBoxOptions: true
      })
    }
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

  handleBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => imageHelper.toBase64(file)));

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
        MuiSwitch: {
          switchBase: {
            color: this.props?.defaultTheme?.primary?.main
          }
        },
        MuiIconButton:{
          root: {
            color: "blue"
            //filter: "drop-shadow( 0px 0px 1px rgba(0, 0, 0, 1))"
          }
        },
        MuiSpeedDial: {
          actionsClosed: {
            height: "0",
            oveflow: "hidden",
          }
        },
        MuiInputBase: {
          root: {
            width: "100%",
            margin: "0 auto",
          }
        },
        MuiInputLabel: {
          formControl: {
            // width: "90%",
            marginLeft: "1%",
          }
        },

        MuiFormLabel: {
          root: {
            marginLeft: "5%",
          }
        },

        MuiAutocomplete: {
          endAdornment: {
            position: "absolute",
            top: "calc(50% - 14px)",
            right: "0px !important",
          }
        },
        MuiOutlinedInput: {
          root: {
            borderRadius: "",
            width: "100%",
            margin: "0 auto",
            height: "50px",
          }
        },

        MuiDialog: {
          paper: {
            width: "100%",
          },
          paperWidthSm: {
            maxWidth: "100vw",
          }
        }
      }
    });
  };

  handleFontSize = (event, newValue) => {
    if (this.state.fontSize !== newValue) {
      this.setState({ fontSize: newValue });
    }
  };

  handleFontFamily = async (event, newValue) => {
    await this.setAsyncState({
      fontFamily: newValue.family,
    });
    this.setUsedGoogleFonts();
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
        <div style={{margin: "0 12px"}}>
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

  async saveBox(data) {

    const items = this.state.items;

    if(data.newItem) {
      delete data.newItem;
      items.push(data);
    } else {
      const itemIndex = items.findIndex(
          (item) => Number(data.i) === Number(item.i)
      );
      items[itemIndex] = data;
    }

    await this.setAsyncState({
      items
    });

    await this.setAsyncState({
      addAnItem: !this.state.addAnItem
    });

    this.setUsedGoogleFonts();

  }

  savePage = async () => {
    const pageConfig = this.preparePageConfiguration();
    if (this.state.editing) {
      const page = {
        id: this.state.page_id,
        pageConfig: pageConfig,
        items: this.state.items,
      };
      await this.props.control.edit({...page, editPage: this.state.editPage});

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
      const pageData = await this.props.control.add(newPage);

      this.props.history.push(`/pages/edit/${pageData.pageId}`);

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

  handleNewCategory = async (event) => {//TODO can be moved into ViewPageOptions
    event.preventDefault();
    event.persist();
    const newTitle = `${this.state.dialogValue.title}`;
    const newDescription = `${this.state.dialogValue.description}`;

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

    const classes = this.props.classes;

    const bodyWrapperStyle = {};
    let hasBgImage = false;

    if(this.state.bgColor && this.state.pageBackgroundColor) {
      bodyWrapperStyle.backgroundColor = this.state.bgColor;
      bodyWrapperStyle.backgroundImage = 'none';
    }

    if(this.state.pageBackgroundGradient) {
      bodyWrapperStyle.backgroundImage = this.state.bgGradientColor;
      hasBgImage = true;
    } else {
      if((this.state.pageBase64Image || this.state.backgroundImage) && this.state.pageBackgroundImage) {
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

    return (
        <React.Fragment>
          { this.state.googleFonts.length ? <GoogleFontLoader
              fonts={this.state.googleFonts}
          /> : <></>}
          <Helmet>
            <title>{this.state.editing ? "Edit Page" : "Add Page"}</title>
          </Helmet>
          <div
              className={classes.bodyWrapper}
              style={{
                minHeight: "100%",
                marginTop: "60px",
                paddingBottom: "130px",
                paddingLeft: this.state.pageTransitionPadding,
                ...bodyWrapperStyle
              }}
          >
            <MuiThemeProvider theme={this.muiTheme}>
              {this.state.showBoxOptions && <ViewBoxOptions
                  defaultTheme={this.props.defaultTheme}
                  onOpen={() => {

                  }}
                  onClose={() => {
                    this.setState({
                      showBoxOptions: false
                    })
                  }}
                  onSave={(item) => {
                    this.saveBox(item);
                    this.setState({
                      showBoxOptions: false
                    })
                  }}
                  fontFamilies={this.state.fontFamilies}
                  item={this.state.boxEditorProps.item}
                  showModal={this.state.showBoxOptions} />}

              <ViewPageOptions
                  data={this.state}
                  getWebsiteData={this.getWebsiteData}
                  defaultTheme={this.props.defaultTheme}
                  createColorPicker={this.createColorPicker}
                  createGradientColorPicker={this.createGradientColorPicker}
                  handleBgImage={this.handleBgImage}
                  handleBackgroundDelete={this.handleBackgroundDelete}
                  handleTemplateChange={this.handleTemplateChange}
                  closePageOptionsModal={()=>this.closePageOptionsModal()}
                  handleInputChange={this.handleInputChange}
                  handleBoxSpacing={this.handleBoxSpacing}
                  handlePageOptions={(data) => this.setState(data)}
                  handleFontSize={this.handleFontSize}
                  handleFontFamily={this.handleFontFamily}
                  handleCategory={this.handleCategory}
                  handleCategoryUniqueness={this.handleCategoryUniqueness}
              />

              <Modal
                  showModal={this.state.showDiscardModal}
                  name="discardModal"
                  title={this.state.modalTitle}
                  modalSize="small"
                  content={<Typography>All changes will be lost. Are you sure you want to continue?</Typography>}
                  confirmButton={{
                    callback: () => this.props.history.push("/pages"),
                    label: "Ok",
                  }}
                  closeButton={{
                    callback: () => {
                      this.closeDiscardModal()
                    },
                    label: "Cancel",
                  }}
              />
              { this.state.livePreview ? <ViewPagesPreview
                  hideBackground={true}
                  isLivePreview={true}
                  control={this.props.control}
                  items={this.state.items}
                  services={this.props.services}
                  pageConfig={this.preparePageConfiguration()} /> : <></>}
              { !this.state.livePreview ? <div className={classes.gridLayout}>
                <div
                    style={{
                      flexGrow: 1,
                      fontFamily: this.state.fontFamily,
                      color: this.state.textColor,
                      paddingBottom: "55px",
                    }}
                >
                  {
                      this.state.items.length > 0 && <ResponsiveReactGridLayout
                          style={{
                            fontFamily: this.state.fontFamily,
                            color: this.state.textColor,
                          }}
                          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                          layouts={this.state.layouts}
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

                </div>
              </div> : <></>}
              <div className={classes.bottomPane} style={{
                backgroundColor: this.props.defaultTheme?.background?.paper
              }}>
                <div>
                  <Tooltip title="Add a new box">
                    <IconButton onClick={(evt) => {
                      this.onAddItem(evt)
                    }}>
                      <Avatar style={{backgroundColor: this.props?.defaultTheme?.primary?.main, color: this.props?.defaultTheme?.primary?.contrastText}}>
                        <AddCircle/>
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add a box from a template">
                    <IconButton onClick={() => {
                      this.setState({
                        showBoxesFromTemplate: true
                      })
                    }}>
                      <Avatar style={{backgroundColor: this.props?.defaultTheme?.primary?.main, color: this.props?.defaultTheme?.primary?.contrastText}}>
                        <PostAdd/>
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={this.state.livePreview ? "Stop Live Preview Mode" : "Turn on Live Preview Mode"}>
                    <IconButton onClick={async () => {
                      await this.setAsyncState(prevState => {
                        return {livePreview: !prevState.livePreview}
                      })
                    }}>
                      <Avatar style={{
                        backgroundColor: this.props?.defaultTheme?.primary?.main,
                        color: this.props?.defaultTheme?.primary?.contrastText
                      }}>
                        {this.state.livePreview ? <StopScreenShare /> : <ScreenShare/>}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Open the preview page"}>
                    <IconButton onClick={() => {
                      window.open( `/pages/preview/${this.state.page_id}` )
                    }}>
                      <Avatar style={{backgroundColor: this.props?.defaultTheme?.primary?.main, color: this.props?.defaultTheme?.primary?.contrastText}}>
                        <Visibility/>
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={this.state.isTemplate ? "Template Options" : "Page Options"}>
                    <IconButton onClick={(evt) => {
                      this.openPageOptionsModal()
                    }}>
                      <Avatar style={{backgroundColor: this.props?.defaultTheme?.primary?.main, color: this.props?.defaultTheme?.primary?.contrastText}}>
                        <Settings/>
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </div>
                <div className={classes.bottomPaneButtons}>
                  <Button
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
              <Modal
                  showModal={this.state.showBoxesFromTemplate}
                  {...this.state.boxesFromTemplate}
              />
              <Modal
                  showModal={this.state.showConfirmDeleteBoxModal}
                  {...this.state.confirmDeleteBoxModal}
              />
              <Snackbar
                  open={this.state.showSavedMessage}
                  place="tc"
                  color="success"
                  icon={InfoSharp}
                  message="The page was updated successfully"
              />
              <Snackbar
                  open={this.state.showErrorMessage}
                  place="tc"
                  color="danger"
                  icon={ErrorSharp}
                  message={this.state.errorMessage}
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