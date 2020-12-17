import React, { Suspense } from "react";
import _ from "lodash";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {
  DeleteForever,
  AddCircle,
  Visibility,
  Edit,
  OpenWith,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import CustomInput from "components/CustomInput/CustomInput.js";
import MoreMenu from "components/MoreMenu/MoreMenu.js";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { withRouter } from "react-router-dom";

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

import Icon from "@material-ui/core/Icon";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PagesAdd extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    //colsClient: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },//PUT THIS ON PRODUCTION AND PREVIEW
    cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
    rowHeight: 1,
  };

  state = {
    temporaryModuleOptions: {},
    showDiscardModal: false,
    itemOnDeleteIndex: "",
    isAddBtnDisabled: true,
    items: [],
    itemSdId: 0,
    newCounter: 0,
    flatCategories: [],

    speedDialState: false,
    modulesList: [
      { label: "Header Module" },
      { label: "Menu Module" },
      { label: "Text Module" },
      { label: "Gallery Module" },
      { label: "Calendar Module" },
      { label: "Video Module" },
      { label: "Audio Module" },
      { label: "Banner Module" },
      { label: "Chart Module" },
      { label: "Table Module" },
    ],
    config: {
      layoutBoxSpacing: [10, 10],
      layoutBoxPadding: {
        lg: [1, 1],
        md: [1, 1],
        sm: [1, 1],
        xs: [1, 1],
        xxs: [1, 1],
      },
    },
    editItemFontSizeShow: false,
    editItemFontFamilyShow: false,
    editItemTextColorShow: false,
    editItemBackgroundColorShow: false,
    editItemTitle: "",
    editItemModule: "",
    editItemBgImage: "",
    editItemBorderRadius: "",
    editItemBorderWidth: 0,
    editItemBorderColor: "",
    editItemBackgroundColor: "",
    editItemFontSize: 0,
    editItemFontFamily: -1,
    editItemTextColor: "",
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
    backgroundImage: "",
    fontSize: "",
    textColor: "#000000",
    fontFamily: "Arial",
    pageTitle: "",
    pageLink: "",
    pageOrItemFontFamily: "",
    pageOrItemTextColor: "",
    displayBgColorPicker: false,
    displayTextColorPicker: false,
    displayItemTextColorPicker: false,
    displayItemBgColorPicker: false,
    displayItemBorderColorPicker: false,
    fontUnit: "px",
    publish: false,
    pageBackgroundRepeat: false,
    pageBackgroundStretch: false,
    defaultPage: false,
    categories: [],
    category: 0,
    isEdit: false, // we will reuse this component to edit and add pages
    editItemModuleOptions: {},
    editModuleOptions: "",
    pageTransitionPadding: "",
    editItemScrollbars: false,
    addAnItem: false,

    backgroundRepeat: false,
    backgroundStretch: false,
    editItemBgRepeat: false,
    editItemBgStretch: false,
    bgColorStyles: {},
    textColorStyles: {},
    itemTextColorStyles: {},
    itemBgColorStyles: {},
    itemBorderColorStyles: {},
  };

  defaultTheme = {};
  muiTheme = {};

  async componentDidMount() {
    let isEdit = this.props.location.pathname.indexOf("pageEdit") > -1;
    let pageId = Number(this.props.match.params.id);

    let categoriesFromStorage = JSON.parse(localStorage.getItem("categories"));

    let categories = this.state.categories;

    if (categoriesFromStorage) {
      categoriesFromStorage.map((category) => {
        categories.push({
          label: category.name,
          id: category.id,
          parentId: category.parentId,
        });
      });
      await this.setAsyncState({ categories });

      this.getAllCategories();
    }

    if (isEdit) {
      let pages = JSON.parse(localStorage.getItem("pages"));

      let currentPage = pages.find((page) => {
        return Number(page.id) === pageId;
      });
      const pageConfig = currentPage.pageConfig;
      const items = JSON.parse(localStorage.getItem("items"));

      if (items !== null) {
        this.setState({
          items,
        });
      }

      if (pageConfig !== null) {
        let savedLayoutBoxSpacing = {
          layoutBoxSpacing: pageConfig.layoutBoxSpacing,
          layoutBoxPadding: {
            lg: [1, 1],
            md: [1, 1],
            sm: [1, 1],
            xs: [1, 1],
            xxs: [1, 1],
          },
        };

        await this.setAsyncState({
          bgColor: pageConfig.backgroundColor,
          backgroundImage: pageConfig.backgroundImage,
          fontSize: pageConfig.fontSize,
          textColor: pageConfig.textColor,
          fontFamily: pageConfig.fontFamily,
          pageTitle: pageConfig.pageTitle,
          pageLink: pageConfig.pageLink,
          defaultConfig: savedLayoutBoxSpacing,
          config: savedLayoutBoxSpacing,
          category: pageConfig.category,
          defaultPage: pageConfig.defaultPage,
          publish: pageConfig.publish,
          pageBackgroundRepeat: pageConfig.backgroundRepeat,
          pageBackgroundStretch: pageConfig.backgroundStretch,
        });
      }
      await this.setAsyncState({
        items: currentPage.items,
        pageConfig: currentPage.pageConfig,
      });
    } else {
      const publicThemes = JSON.parse(localStorage.getItem("publicThemes"));

      let defaultPublicTheme;

      if (publicThemes) {
        defaultPublicTheme = publicThemes.find(
          (theme) => theme.isdefault === true
        );
      }

      this.defaultTheme = this.props.defaultTheme;

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
        if (defaultPublicTheme.fontsize) {
          this.setState({ fontSize: defaultPublicTheme.fontsize });
        }
        if (defaultPublicTheme.textcolor) {
          this.setState({ textColor: defaultPublicTheme.textcolor });
        }
        if (defaultPublicTheme.fontfamily) {
          this.setState({ fontFamily: defaultPublicTheme.fontfamily });
        }
        if (defaultPublicTheme.boxSpacingConfig) {
          this.setState({ config: defaultPublicTheme.boxSpacingConfig });
        }
      }
    }

    await this.setAsyncState({
      bgColorStyles: this.sendStyles(this.state.bgColor),
      textColorStyles: this.sendStyles(this.state.textColor),
      itemTextColorStyles: this.sendStyles(this.state.editItemTextColor),
      itemBgColorStyles: this.sendStyles(this.state.editItemBackgroundColor),
      itemBorderColorStyles: this.sendStyles(this.state.editItemBorderColor),
    });

    await this.setAsyncState({
      isEdit: isEdit,
      pageId: pageId,
    });
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  addPagePadding = async () => {
    await this.setAsyncState({ pageTransitionPadding: "300px" });
  };

  removePagePadding = () => {
    this.setState({ pageTransitionPadding: "" });
  };

  async toggleItemSD(id, state) {
    if (!state) {
      id = 0;
    }
    await this.setAsyncState({
      itemSdId: id,
    });
  }

  setTemporaryModuleOptions = (id, data, isVertical) => {
    let allTempModuleOptions = this.state.temporaryModuleOptions;
    allTempModuleOptions[Number(id)] = { data: data, isVertical: isVertical };
    this.setState({ temporaryModuleOptions: allTempModuleOptions });
  };

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
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

    if (el.backgroundImage) {
      itemStyle.backgroundImage = `url(${el.backgroundImage})`;
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

    if (el.backgroundColor) {
      itemStyle.backgroundColor = el.backgroundColor;
    } else {
      itemStyle.backgroundColor = this.state.bgColor;
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
          this.onRemoveItem(el.i);
        },
        icon: <DeleteForever className={this.props.classes.removeItemIcon} />,
        name: "Delete Item",
      },
      {
        callback: () => {
          this.addPagePadding();
          this.handleEdit(el.i);
        },
        icon: <Edit className={this.props.classes.editItemIcon} />,
        name: "Edit Item",
      },
    ];

    return (
      <div key={i} data-grid={el} style={itemStyle}>
        <div
          style={{ fontSize: "12px", color: "black", verticalAlign: "middle" }}
        >
          <Tooltip title="Drag Box">
            <Icon
              style={{ cursor: "grab" }}
              class="MyDragHandleClassName"
              color="primary"
              size="medium"
            >
              <OpenWith />
            </Icon>
          </Tooltip>
          &nbsp; {el.title}
        </div>
        <span className={this.props.classes.itemSpeedDialWrapper}>
          <MoreMenu itemActions={itemActions} />
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            height: "48px",
            right: 0,
            left: 0,
          }}
        >
          <span className={this.props.classes.editModuleIconWrapper}>
            {el.module && LazyModule ? (
              <Suspense fallback={loadingFallback}>
                <LazyModule
                  defaultTheme={this.props.defaultTheme}
                  onStartEditingModule={() => this.onStartEditingModule()}
                  onEndEditingModule={() => this.onEndEditingModule()}
                  boxId={el.i}
                  moduleOptions={el.moduleOptions}
                  handleSave={(id, data) => {
                    this.saveModuleOptions(id, data);
                  }}
                />
              </Suspense>
            ) : (
              ""
            )}
          </span>
        </div>
      </div>
    );
  }

  onAddItem() {
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
        title: "New Box",
        showScrollbars: "",
        module: "",
        moduleOptions: { data: "" },
        borderColor: "#959595", // the lightest grey shade that doesn't bother the eyes
        borderStyle: "solid",
        borderWidth: "0",
        borderRadius: "0",
        backgroundImage: "",
        backgroundRepeat: "",
        backgroundStretch: "",
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
        let pageTitle = [this.state.pageTitle];
        pageTitle = event.target.value;
        this.setState({ pageTitle });
        break;
      case "pageLink":
        let pageLink = [this.state.pageLink];
        pageLink = event.target.value;
        this.setState({ pageLink });
        break;
      case "moduleOptions":
        let editModuleOptions = [...this.state.editModuleOptions];
        editModuleOptions = event.target.value;
        this.setState({ editModuleOptions });
        break;
      case "itemTitle":
        let items = [...this.state.items];

        let item = this.getItemById(this.state.itemEditId);
        item.title = event.target.value;

        let itemIndex = items.findIndex(
          (item) => item.i === this.state.itemEditId
        );

        items[itemIndex] = item;
        await this.setAsyncState({ editItemTitle: event.target.value + "" });
    }
  };

  closeDiscardModal() {
    this.setState({ showDiscardModal: false });
  }

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  getFontFamilyIndex(name) {
    return this.state.fontFamilies.findIndex((font) => {
      return font.label === name;
    });
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

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemEditId: id,
    });
    const item = this.getItemById(id);

    await this.setAsyncState({
      editItemScrollbars: item.showScrollbars,
      editItemTitle: item.title,
      editItemModule: this.getModuleIndex(item.module),
      editItemModuleOptions: item.moduleOptions,
      editItemBorderRadius: item.borderRadius || 0,
      editItemBorderWidth: item.borderWidth || 0,
      editItemBorderColor: item.borderColor,
      editItemBorderStyle: item.borderStyle,
      editItemFontSize: item.fontSize || 5,
      editItemBackgroundColor: item.backgroundColor || "",
      editItemBgImage: item.backgroundImage,
      editItemBgRepeat: item.backgroundRepeat,
      editItemBgStretch: item.backgroundStretch,
      editItemFontFamily: this.getFontFamilyIndex(item.fontFamily) || -1,
      editItemTextColor: item.textColor || "",
      editItemBackgroundColorShow: item.hasOwnProperty("backgroundColor"),
      editItemFontSizeShow: item.hasOwnProperty("fontSize"),
      editItemFontFamilyShow: item.hasOwnProperty("fontFamily"),
      editItemTextColorShow: item.hasOwnProperty("textColor"),
    });
    await this.setAsyncState({
      showEditMenu: !this.state.showEditMenu,
    });
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
      config = {
        layoutBoxSpacing: [newValue, newValue],
        layoutBoxPadding: {
          lg: [1, 1],
          md: [1, 1],
          sm: [1, 1],
          xs: [1, 1],
          xxs: [1, 1],
        },
      };
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
    });
  };

  handleItemFontFamily = async (event, newValue) => {
    const fontFamily = newValue ? this.getFontFamilyIndex(newValue.label) : "";

    await this.setAsyncState({
      editItemFontFamily: +fontFamily,
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

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleItemBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));

      this.setAsyncState({
        editItemBgImage: strings[0],
      });
    }
  };

  handleItemBgRepeat = async (event) => {
    this.setState({
      editItemBgRepeat: !this.state.editItemBgRepeat,
    });
  };

  handleItemBgStretch = async (event) => {
    this.setState({
      editItemBgStretch: !this.state.editItemBgStretch,
    });
  };

  handleBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));

      this.setAsyncState({
        backgroundImage: strings[0],
      });
    }
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
    foundItem.backgroundImage = this.state.editItemBgImage;
    foundItem.backgroundRepeat = this.state.editItemBgRepeat;
    foundItem.backgroundStretch = this.state.editItemBgStretch;

    //foundItem.moduleOptions = this.state.moduleOptions;

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

    if (this.state.editItemScrollbars) {
      foundItem.showScrollbars = this.state.editItemScrollbars;
    } else {
      delete foundItem.showScrollbars;
    }

    if (Number(this.state.editItemBorderWidth)) {
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

  handleBgImage(acceptedFiles) {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // for MuiThemeProvider

  createDefaultTheme = () => {
    return createMuiTheme({
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
    this.setState({
      fontSize: newValue,
    });
  };

  handleFontFamily = async (event, newValue) => {
    await this.setAsyncState({
      fontFamily: newValue.label,
      pageOrItemFontFamily: "page",
    });
  };

  handleCategory = async (event, newValue) => {
    let newCatId = newValue && newValue.id ? newValue.id : 0;
    await this.setAsyncState({
      category: newCatId,
    });
  };

  getCategoriesNested(id) {
    let result = "";
    let link = this.state.categories.find((el) => el.id === id);
    result = link.label;
    if (link && link.parentId) {
      result = this.getCategoriesNested(link.parentId) + "/" + result;
    }
    return result;
  }

  getAllCategories = async () => {
    let result = [];

    if (this.state.categories.length) {
      let links = this.state.categories;
      links.map((el) => {
        let linkName = el.label;
        if (el.parentId) {
          linkName = this.getCategoriesNested(el.parentId) + "/" + el.label;
        }
        result.push({
          id: el.id,
          label: linkName,
        });
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
              onChangeComplete={(color) => {
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

  savePage = () => {
    let pageConfig = {
      backgroundColor: this.state.bgColor,
      backgroundImage: this.state.backgroundImage,
      fontSize: this.state.fontSize,
      textColor: this.state.textColor,
      fontFamily: this.state.fontFamily,
      layoutBoxSpacing: this.state.config.layoutBoxSpacing,
      pageTitle: this.state.pageTitle,
      pageLink: this.state.pageLink,
      publish: this.state.publish,
      backgroundRepeat: this.state.pageBackgroundRepeat,
      backgroundStretch: this.state.pageBackgroundStretch,
      defaultPage: this.state.defaultPage,
      category: this.state.category,
    };

    let pages = JSON.parse(localStorage.getItem("pages")) || [];

    if (this.state.defaultPage) {
      pages.map((page) => (page.pageConfig.defaultPage = false));
    }

    if (this.state.isEdit) {
      if (pages.length) {
        pages = pages.map((page) => {
          if (page.id === this.state.pageId) {
            return {
              id: page.id,
              pageConfig: pageConfig,
              items: this.state.items,
            };
          } else {
            return page;
          }
        });
      }
    } else {
      let newPageId = 0;

      if (pages.length) {
        pages.map((page) => {
          newPageId = Number(page.id) > newPageId ? Number(page.id) : newPageId;
          return page;
        });
      }

      newPageId++;

      let newPage = {
        id: newPageId,
        pageConfig: pageConfig,
        items: this.state.items,
      };
      pages.push(newPage);
    }

    localStorage.setItem("pages", JSON.stringify(pages));

    this.props.history.push("/pages");
  };

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.state.isEdit ? "Edit Page" : "Add Page"}</title>
        </Helmet>
        <div
          style={{
            marginTop: "60px",
            paddingBottom: "60px",
            paddingLeft: this.state.pageTransitionPadding,
          }}
          className={this.props.classes.bodyWrapper}
        >
          <MuiThemeProvider theme={this.muiTheme}>
            <Drawer
              BackdropProps={{ invisible: true }}
              variant="temporary"
              anchor={"left"}
              open={this.state.showEditMenu}
              onClose={this.handleEditMenu}
              className={this.props.classes.sideMenu}
            >
              <div className={this.props.classes.sideMenuEditor}>
                <div className={this.props.classes.sideMenuEditorForm}>
                  <h3>Edit Box Properties</h3>
                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Show scrollbars if the content exceeds the box">
                        <Switch
                          checked={this.state.editItemScrollbars}
                          onChange={() => {
                            this.setState({
                              editItemScrollbars: !this.state
                                .editItemScrollbars,
                            });
                          }}
                          value={this.state.editItemScrollbars}
                        />
                      </Tooltip>
                      Scrollbars
                    </Typography>
                  </div>
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
                          value={this.state.editItemFontSizeShow}
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
                        defaultValue={Number(this.state.editItemFontSize)}
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
                              editItemFontFamily: -1,
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
                        value={
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
                          ? { position: "relative" }
                          : { display: "none" }
                      }
                    >
                      {this.createColorPicker(
                        "itemTextColorStyles",
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
                          ? { position: "relative" }
                          : { display: "none" }
                      }
                    >
                      {this.createColorPicker(
                        "itemBgColorStyles",
                        "displayItemBgColorPicker",
                        "editItemBackgroundColor"
                      )}
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Typography gutterBottom>Border Color</Typography>
                    {this.createColorPicker(
                      "itemBorderColorStyles",
                      "displayItemBorderColorPicker",
                      "editItemBorderColor"
                    )}
                  </div>
                  <div>
                    <Typography gutterBottom>Border Width</Typography>
                    <Slider
                      defaultValue={Number(this.state.editItemBorderWidth)}
                      className={this.props.classes.sideMenuSlider}
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
                      defaultValue={Number(this.state.editItemBorderRadius)}
                      className={this.props.classes.sideMenuSlider}
                      onChangeCommitted={this.handleBorderRadius}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={30}
                    />
                  </div>

                  <div>
                    <Typography gutterBottom>Background Image</Typography>
                    <div className={this.props.classes.dropzoneAreaWrapper}>
                      <DropzoneArea
                        filesLimit={1}
                        className={this.props.classes.dropzone}
                        onChange={this.handleItemBgImage.bind(this)}
                      />
                    </div>
                  </div>

                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Background Repeat">
                        <Switch
                          checked={this.state.editItemBgRepeat}
                          onChange={this.handleItemBgRepeat.bind(this)}
                          value={this.state.editItemBgRepeat}
                        />
                      </Tooltip>
                      Background Repeat
                    </Typography>
                  </div>

                  <div>
                    <Typography id="discrete-slider" gutterBottom>
                      <Tooltip title="Background Stretch">
                        <Switch
                          checked={this.state.editItemBgStretch}
                          onChange={this.handleItemBgStretch.bind(this)}
                          value={this.state.editItemBgStretch}
                        />
                      </Tooltip>
                      Background Stretch
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={this.props.classes.sideMenuActionHolder}>
                <Button
                  className={this.props.classes.sideMenuSaveBtn}
                  color="primary"
                  onClick={() => {
                    this.removePagePadding();
                    this.saveChangedStyle();
                  }}
                >
                  Save
                </Button>
                <Button
                  className={this.props.classes.sideMenuCancelBtn}
                  color="danger"
                  onClick={() => {
                    this.removePagePadding();
                    this.closeEditSideMenu();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Drawer>
            <Dialog
              classes={{
                root: this.props.classes.center,
                paper: this.props.classes.modal,
              }}
              open={this.state.showDiscardModal}
              TransitionComponent={this.transition}
              keepMounted
              onClose={() => this.closeDiscardModal()}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
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
                  disabled={this.state.isBtnDisabled}
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
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <Accordion className={this.props.classes.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header"
                    >
                      <div className={this.props.classes.column}>
                        <Typography className={this.props.classes.typography}>
                          Page Options
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <Divider />

                    <AccordionDetails
                      className={this.props.classes.accordionDetails}
                    >
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
                          "bgColorStyles",
                          "displayBgColorPicker",
                          "bgColor"
                        )}

                        <h5>Background Image</h5>
                        <div className={this.props.classes.dropzoneAreaWrapper}>
                          <DropzoneArea
                            filesLimit={1}
                            className={this.props.classes.dropzone}
                            onChange={this.handleBgImage.bind(this)}
                          />
                        </div>

                        <div>
                          <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Background Repeat">
                              <Switch
                                checked={this.state.pageBackgroundRepeat}
                                onChange={() => {
                                  this.setState({
                                    pageBackgroundRepeat: !this.state
                                      .pageBackgroundRepeat,
                                  });
                                }}
                                value={this.state.pageBackgroundRepeat}
                              />
                            </Tooltip>
                            Background Repeat
                          </Typography>
                        </div>

                        <div>
                          <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Background Stretch">
                              <Switch
                                checked={this.state.pageBackgroundStretch}
                                onChange={() => {
                                  this.setState({
                                    pageBackgroundStretch: !this.state
                                      .pageBackgroundStretch,
                                  });
                                }}
                                value={this.state.pageBackgroundStretch}
                              />
                            </Tooltip>
                            Background Stretch
                          </Typography>
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
                        <div>
                          <Typography id="discrete-slider" gutterBottom>
                            Font Size
                          </Typography>
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
                        <h5>Text Color</h5>
                        {this.createColorPicker(
                          "textColorStyles",
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
                      <div
                        className={clsx(
                          this.props.classes.column,
                          this.props.classes.helper
                        )}
                      >
                        <h4>Miscellaneous</h4>
                        <div>
                          <Typography id="discrete-slider" gutterBottom>
                            Box Spacing
                          </Typography>
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
                        </div>
                        <div>
                          <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Enable Publishing">
                              <Switch
                                checked={this.state.publish}
                                onChange={() => {
                                  this.setState({
                                    publish: !this.state.publish,
                                  });
                                }}
                                value={this.state.publish}
                              />
                            </Tooltip>
                            Publish
                          </Typography>
                        </div>
                        <div>
                          <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Set as default page">
                              <Switch
                                checked={this.state.defaultPage}
                                onChange={() => {
                                  this.setState({
                                    defaultPage: !this.state.defaultPage,
                                  });
                                }}
                                value={true}
                              />
                            </Tooltip>
                            Default Page
                          </Typography>
                        </div>
                        <div>
                          <Autocomplete
                            id="categoryDropdown"
                            onChange={this.handleCategory}
                            className={this.props.classes.option}
                            options={this.state.flatCategories}
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            // value={this.getCategoryItem(this.state.category)}
                            // onChange={(ev, value) => {
                            //   columnData.onRowDataChange({
                            //     ...columnData.rowData,
                            //     parentId: value.id,
                            //   });
                            // }}
                            renderInput={(params) => (
                              <TextField
                                className={this.props.classes.textfield}
                                {...params}
                                label="Choose a category"
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <CustomInput
                            labelText="Page Link"
                            id="pageLink"
                            required="required"
                            formControlProps={{
                              fullWidth: true,
                              onChange: (event) =>
                                this.handleInputChange(event),
                            }}
                            inputProps={{
                              inputProps: {
                                minLength: "3",
                                maxLength: "50",
                              },
                              value: this.state.pageLink,
                              type: "text",
                            }}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div className={this.props.classes.iconsWrapper}>
                  <Tooltip title="Add a new box">
                    <IconButton
                      color="primary"
                      onClick={() => this.onAddItem()}
                    >
                      <AddCircle
                        className={this.props.classes.rightSideIcon}
                        color="primary"
                      />{" "}
                    </IconButton>
                  </Tooltip>

                  {this.props.history.location.pathname.includes("pageEdit") ? (
                    <Tooltip title="Go to preview page">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          window.open(
                            `/pagePreview/${this.props.match.params.id}`
                          );
                        }}
                      >
                        <Visibility
                          className={this.props.classes.rightSideIcon}
                          color="primary"
                        />{" "}
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className={this.props.classes.pageTitleInputWrapper}>
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
                  backgroundImage: `url(${this.state.backgroundImage})`,
                  backgroundRepeat: this.state.pageBackgroundRepeat
                    ? "repeat"
                    : "no-repeat",
                  backgroundSize: this.state.pageBackgroundStretch
                    ? "cover"
                    : "auto",
                  backgroundColor: this.state.bgColor,
                  fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                  fontFamily: this.state.fontFamily,
                  color: this.state.textColor,
                }}
              >
                <ResponsiveReactGridLayout
                  style={{
                    backgroundImage: `url(${this.state.backgroundImage})`,
                    backgroundRepeat: this.state.pageBackgroundRepeat
                      ? "repeat"
                      : "no-repeat",
                    backgroundSize: this.state.pageBackgroundStretch
                      ? "cover"
                      : "auto",
                    backgroundColor: this.state.bgColor,
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.textColor,
                  }}
                  // margin={this.state.boxSpacing} primeste un array cu 2 valori
                  isBounded={true}
                  margin={this.state.config.layoutBoxSpacing}
                  containerPadding={this.state.config.layoutBoxPadding}
                  draggableHandle=".MyDragHandleClassName"
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
                this.savePage();
              }}
              className={this.props.classes.savePageButton}
              color="primary"
            >
              <div>Save</div>
            </Button>
            <Button
              onClick={() => this.handleDiscard()}
              className={this.props.classes.cancelPageButton}
              color="danger"
            >
              Discard
            </Button>
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(PagesAdd));
