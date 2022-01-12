import React, {Suspense} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
    createTheme, MuiThemeProvider, withStyles,
} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {
    AddCircle,
    Settings,
    DeleteForever,
    Edit,
    OpenWith,
    Visibility,
    InfoSharp,
    ScreenShare,
    StopScreenShare,
    PostAdd,
    ErrorSharp,
    FileCopy
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import Modal from "../../components/Modal/Modal";
import Snackbar from "components/Snackbar/Snackbar.js";
import Button from "components/CustomButtons/Button.js";

import {Helmet} from "react-helmet";

import imageHelper from "helpers/image.helper";
import GoogleFontLoader from 'react-google-font-loader';
import fontsList from "../../config/google_fonts.js";

import ViewPagesPreview from "./ViewPagesPreview";
import ViewBoxesFromTemplate from "./ViewBoxesFromTemplate";
import ViewPageOptions from "./ViewPageOptions";
import ViewBoxOptions from "./ViewBoxOptions";

import {Responsive, WidthProvider} from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewPagesEditor extends React.PureComponent {

    state = {
        pageId: 0,
        items: [],
        pageConfig: {
            title: "", link: "", description: "", useDefaultMeta: false,

            isTemplate: false, templateId: 0, isHome: false, active: false,

            layoutBoxSpacing: [10, 10], layoutBoxPadding: {
                lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0], xxs: [0, 0],
            },
        },

        boxId: "",
        boxEditorProps: {
            item: {},
        },

        editing: this.props.location.pathname.indexOf("edit") > -1,
        livePreview: false,

        showPageOptionsModal: this.props.location.pathname.indexOf("edit") === -1,
        showBoxOptions: false,
        showDeleteBoxModal: false,
        showDeleteTemplateBoxModal: false,
        showTemplateWarning: false,
        showBoxesFromTemplate: false,
        showDiscardModal: false,
        showSavedMessage: false,
        showErrorMessage: false,
        errorMessage: "",

        googleFonts: [],
    };

    fontSizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].map(n => {return {label: `${n}`, value: n}});

    muiTheme = {};

    setUsedGoogleFonts() {
        const fonts = [];

        if (this.state.fontFamily && this.state.fontFamily.length) {
            fonts.push({font: this.state.fontFamily});
        }

        if (this.state.items && this.state.items.length) {
            this.state.items.map((item) => {
                if (item.fontFamily && !fonts.some(f => f.font === item.fontFamily)) {
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

    async getPageDetails(pageId, fromTemplate) {
        let currentPage = await this.props.control.get({id: parseInt(pageId)});
        let {pageConfig, items, title, link, isHome, isTemplate, active} = currentPage;

        pageConfig = {
            ...pageConfig, title: title, link: link, isHome: !!isHome, isTemplate: !!isTemplate, active: !!active,
        };

        const statePayload = {
            items: [], pageConfig: pageConfig
        };

        if (fromTemplate && items && items.length) {
            items = items.map((item) => {
                return {
                    ...item, templateId: pageId, resizeHandles: []
                }
            });
            statePayload['items'] = items;
        }

        await this.setAsyncState(statePayload);

        this.setUsedGoogleFonts();
    }

    async componentDidMount() {
        this.muiTheme = this.createDefaultTheme();

        let editing = this.state.editing;
        let pageId = this.props.location.pathObject[2];



        const pageConfig = this.state.pageConfig;

        if (editing) {
            await this.getPageDetails(pageId);
        } else {
            //TODO GET THE DEFAULT THEME CORRECTLY AND SET THE DEFAULT PAGE PROPS HERE
            if (this.props.location?.state?.templateMode) {
                pageConfig['isTemplate'] = this.props.location.state.templateMode;
            }
        }

        this.setState({
            pageConfig, editing, pageId
        });
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    modals = {
        deleteBoxModal: {
            name: "deleteBoxModal",
            title: "Confirm Delete Box",
            itemId: "",
            content: "Are you sure you want to delete this box?",
            modalSize: "small",
            closeButton: {
                callback: () => {
                    this.setState({showDeleteBoxModal: false});
                }, label: "Cancel",
            },
            confirmButton: {
                show: true, callback: () => {
                    this.setState({showDeleteBoxModal: false});
                    this.onRemoveItem(this.state.deleteBoxModal.itemId);
                }, label: "Delete",
            },
        },
        deleteTemplateBoxModal: {
            name: "deleteTemplateBoxModal",
            title: "Confirm Delete Template Box",
            itemId: "",
            content: <div>This box is from a template. The original box will not be deleted. Are you sure you want to
                delete it?</div>,
            closeButton: {
                callback: () => {
                    this.setState({showDeleteTemplateBoxModal: false});
                }, label: "Cancel",
            },
            confirmButton: {
                show: true, callback: () => {
                    this.setState({showDeleteTemplateBoxModal: false});
                    this.onRemoveItem(this.state.deleteTemplateBoxModal.itemId);
                }, label: "Delete Anyway",
            },
        },
        boxesFromTemplate: {
            name: "boxesFromTemplate",
            title: "Select Box From a Template",
            content: <ViewBoxesFromTemplate {...this.props} updateBoxList={(boxes) => this.updateBoxList(boxes)}/>,
            closeButton: {
                callback: () => {
                    this.setState({showBoxesFromTemplate: false});
                }, label: "Cancel",
            },
            confirmButton: {
                show: false, callback: async () => {
                    if (this.state.newBoxList && this.state.newBoxList.length > 0) {
                        this.setState({showBoxesFromTemplate: false});
                        const items = [...this.state.items];
                        await this.setAsyncState({
                            items: [...items, ...this.state.newBoxList]
                        })
                    } else {
                        this.setState({
                            showErrorMessage: true, errorMessage: "Please Select Box First!"
                        });

                        setTimeout(() => {
                            this.setState({
                                showErrorMessage: false, errorMessage: ""
                            })
                        }, 3000);
                    }
                }, label: "Add",
            },
        },
        templateWarningModal: {
            name: "templateWarningModal",
            title: "Confirm Edit Template",
            content: <div>This box is from a template. Do you want to open it in a new tab so you can edit it?</div>,
            closeButton: {
                callback: () => {
                    this.setState({showTemplateWarning: false});
                }, label: "Cancel",
            },
            confirmButton: {
                show: true, callback: () => {
                    this.setState({showTemplateWarning: false});
                    const win = window.open(`/pages/edit/${this.state.templateEditId}`, "_blank");
                    win.focus();
                }, label: "Open Template",
            },
        },
    }

    createElement(el) {
        const i = el.i;

        let itemStyle = {};

        if (el.showScrollbars) {
            itemStyle.showScrollbars = el.showScrollbars;
        }

        if (el.fontFamily) {
            itemStyle.fontFamily = el.fontFamily;
        }

        if (el.textColor) {
            itemStyle.color = el.textColor;
        }

        if (el.backgroundImageString) {
            itemStyle.backgroundImage = `url(${el.backgroundImageString})`;
        } else {
            itemStyle.backgroundImage = `url(/files/pages/page-${el.templateId ? el.templateId : this.state.pageId}/box-${i}/${el.backgroundImage})`;
        }

        if (el.backgroundImage && el.backgroundImage.indexOf("__delete__") === 0) {
            el.backgroundImageString = "";
            itemStyle.backgroundImage = "";
        }

        itemStyle.backgroundRepeat = el.backgroundRepeat ? "repeat" : "no-repeat";

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

        const moduleStyle = {};

        if (el.backgroundImage) {
            moduleStyle.backgroundImage = `url(/files/pages/page-${el.templateId ? el.templateId : this.state.pageId}/box-${i}/${el.backgroundImage})`;
        }

        moduleStyle.backgroundRepeat = el.backgroundRepeat ? "repeat" : "no-repeat";

        moduleStyle.backgroundSize = el.backgroundStretch ? "cover" : "auto";

        if (el.backgroundGradient) {
            moduleStyle.backgroundImage = el.backgroundGradientColor;
        }

        if (el.backgroundColor) {
            moduleStyle.backgroundColor = el.backgroundColor;
        }

        if (el.borderColor) {
            moduleStyle.borderColor = el.borderColor;
        }

        if (el.borderWidth) {
            moduleStyle.borderStyle = "solid";
            moduleStyle.borderWidth = el.borderWidth + "px";
        }

        if (el.borderRadius) {
            moduleStyle.borderRadius = el.borderRadius;
        }

        if (Number(el.fontSize)) {
            moduleStyle.fontSize = `${el.fontSize}${this.state.pageConfig.fontUnit}`;
            moduleStyle.lineHeight = `${el.fontSize}${this.state.pageConfig.fontUnit}`;
        } else if (this.state.pageConfig?.fontSize) {
            moduleStyle.fontSize = `${this.state.pageConfig.fontSize}${this.state.pageConfig.fontUnit}`;
            moduleStyle.lineHeight = `${this.state.pageConfig.fontSize}${this.state.pageConfig.fontUnit}`;
        }

        if (el.fontFamily) {
            moduleStyle.fontFamily = el.fontFamily;
        } else if (this.state.pageConfig?.fontFamily) {
            moduleStyle.fontFamily = this.state.pageConfig.fontFamily;
        }

        if (el.textColor) {
            moduleStyle.color = el.textColor;
        } else if (this.state.pageConfig?.textColor) {
            moduleStyle.textColor = this.state.pageConfig.textColor;
        }

        if (el.showScrollbars) {
            moduleStyle.overflow = "auto";
        } else {
            moduleStyle.overflow = "hidden";
        }

        let LazyModule = false;
        const loadingFallback = (() => {
            return <span>Loading...</span>;
        })();

        if (el.module) {
            const moduleType = el.module.replaceAll(" ", "");
            LazyModule = React.lazy(() => import(`./box/previews/${moduleType}`));
        }

        const classes = this.props.classes;
        return (
            <div key={i} data-grid={el} style={itemStyle}>
                <div className={classes.boxControls}>
                    <div style={{color: "black", verticalAlign: "middle"}}>
                        <Tooltip title="Drag Box">
                            <IconButton className="MyDragHandleClassName" color="primary">
                                <OpenWith color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <div className={classes.renderBoxTitle}>
                            <h1>{el.title}</h1>
                        </div>
                    </div>
                    <div className={classes.editorButtonWrapper}>
                        <Tooltip title="Show box properties">
                            <IconButton onClick={() => {
                                this.handleBoxOptions(i)
                            }}>
                                <Avatar style={{
                                    backgroundColor: this.props.defaultTheme.secondary.main,
                                    color: this.props.defaultTheme.secondary.contrastText
                                }}>
                                    <Edit/>
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Make a copy of this box">
                            <IconButton onClick={() => {
                                this.onDuplicate(el.i)
                            }}>
                                <Avatar style={{
                                    backgroundColor: this.props.defaultTheme?.primary?.main,
                                    color: this.props.defaultTheme?.primary?.contrastText
                                }}>
                                    <FileCopy/>
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete this box">
                            <IconButton onClick={async () => {
                                if (el.templateId) {
                                    this.setState((prevState) => {
                                        return {
                                            showDeleteTemplateBoxModal: true,
                                            deleteTemplateBoxModal: {
                                                ...prevState.deleteTemplateBoxModal,
                                                itemId: el.i
                                            }
                                        }
                                    })
                                    return
                                }
                                this.setState((prevState) => {
                                    return {
                                        showDeleteBoxModal: true,
                                        deleteBoxModal: {
                                            ...prevState.deleteBoxModal,
                                            itemId: el.i
                                        }
                                    }
                                });
                            }}>
                                <Avatar style={{
                                    backgroundColor: this.props.defaultTheme.error.main,
                                    color: this.props.defaultTheme.error.contrastText
                                }}>
                                    <DeleteForever/>
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.boxLazyModuleWrapper}>
                    {el.module && LazyModule ? (
                        <Suspense fallback={loadingFallback}>
                            <LazyModule
                                key={`box-${el.id || el.i}`}
                                boxId={el.cloneId ? el.cloneId : Number(el.id || 0)}
                                pageId={this.state.pageId}
                                moduleOptions={el.moduleOptions}
                                style={{style: moduleStyle}}
                                defaultTheme={this.props.defaultTheme}
                                pageOptions={{
                                    pageId: this.state.pageId
                                }}
                                handleSave={async (id, data) => {
                                    await this.saveModuleOptions(id, data);
                                }}
                                control={this.props.control}
                                services={this.props.services}
                            />
                        </Suspense>
                    ) : ""}
                </div>
            </div>);
    }

    saveModuleOptions = async (passedId, data) => {
        let items = [...this.state.items];

        let item = this.getItemById(passedId);

        item.moduleOptions = {data: data};

        let itemIndex = items.findIndex((item) => Number(item.i) === Number(passedId));

        items[itemIndex] = item;

        await this.setAsyncState({items});
    };

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
            targetItem.cloneId = existingItem.id;
            targetItem.files = existingItem.files;
            targetItem.x = 0;
            targetItem.y = Infinity;

            if (!targetItem.backgroundImageFile && existingItem.backgroundImage) {
                const bgResponse = await fetch(`/files/pages/page-${existingItem.templateId ? existingItem.templateId : this.state.pageId}/box-${id}/${existingItem.backgroundImage}`);
                const bgBlob = await bgResponse.blob();
                targetItem.backgroundImageFile = new File([bgBlob], existingItem.backgroundImage);
                targetItem.backgroundImageString = await Promise.all([imageHelper.toBase64(targetItem.backgroundImageFile)]);
            }

            items.push(targetItem);

            this.setState({
                items: items
            });
            window.scrollTo(0, document.body.scrollHeight);
        } catch (err) {
            console.log(err);
        }
    }

    async onAddItem() {
        let newId = 0;

        this.setState({
            boxEditorProps: {}
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
                moduleOptions: {data: ""},
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

            window.scrollTo(0, document.body.scrollHeight);
        } catch (err) {
            console.log(err);
        }
    }

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

            const pageConfig = this.state.pageConfig;
            pageConfig.layouts = layouts;

            this.setState({items: newItems, pageConfig});
        } catch (err) {
            console.log(err);
        }
    };

    onRemoveItem(i) {
        this.setState({
            items: _.reject(this.state.items, {i: i}),
        });
    }

    closeDiscardModal() {
        this.setState({showDiscardModal: false});
    }

    closePageOptionsModal() {
        this.setState({showPageOptionsModal: false});
    }

    openPageOptionsModal() {
        this.setState({showPageOptionsModal: true});
    }

    handleBoxOptions = async (id) => {
        const item = this.getItemById(id);
        await this.setAsyncState({
            boxId: id, templateEditId: item.templateId
        });

        if (item.templateId) {
            this.setState({
                showTemplateWarning: true
            })
        } else {
            await this.setAsyncState({
                boxEditorProps: {
                    ...item,
                }
            });
            this.setState({
                showBoxOptions: true
            })
        }
    }

    handleDiscard () {
        this.setState({showDiscardModal: true});
    };

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiSwitch: {
                    switchBase: {
                        color: this.props.defaultTheme?.primary?.main
                    }
                }, MuiIconButton: {
                    root: {
                        color: "blue"
                    }
                }, MuiSpeedDial: {
                    actionsClosed: {
                        height: "0", oveflow: "hidden",
                    }
                }, MuiInputBase: {
                    root: {
                        width: "100%", margin: "0 auto",
                    }
                }, MuiInputLabel: {
                    formControl: {
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
                        position: "absolute", top: "calc(50% - 14px)", right: "0px !important",
                    }
                }, MuiOutlinedInput: {
                    root: {
                        borderRadius: "", width: "100%", margin: "0 auto", height: "50px",
                    }
                },
                MuiDialog: {
                    paper: {
                        width: "100%",
                    }, paperWidthSm: {
                        maxWidth: "100vw",
                    }
                }
            }
        });
    };

    async saveBox(data) {
        const items = this.state.items;

        if (data.newItem) {
            delete data.newItem;
            items.push(data);
        } else {
            const itemIndex = items.findIndex((item) => Number(data.i) === Number(item.i));
            items[itemIndex] = data;
        }

        await this.setAsyncState({
            items,
            showBoxOptions: false
        });

        this.setUsedGoogleFonts();
    }

    async savePage() {
        const pageConfig = {...this.state.pageConfig};
        if (this.state.editing) {
            const payload = {
                id: this.state.pageId,
                title: pageConfig.title,
                link: pageConfig.link,
                description: pageConfig.description,
                isHome: pageConfig.isHome,
                active: pageConfig.active,
                pageConfig: this.state.pageConfig,
                items: this.state.items,
            };
            await this.props.control.edit(payload);

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
                pageConfig: pageConfig, items: this.state.items,
            };
            const pageData = await this.props.control.add(newPage);
            this.props.history.push(`/pages/edit/${pageData.pageId}`);
        }
    };

    render() {
        const classes = this.props.classes;

        const bodyWrapperStyle = {};
        let hasBgImage = false;

        if (this.state.pageConfig.backgroundColor && this.state.pageConfig.hasBackgroundColor) {
            bodyWrapperStyle.backgroundColor = this.state.pageConfig.backgroundColor;
            bodyWrapperStyle.backgroundImage = 'none';
        }

        if (this.state.pageConfig.hasBackgroundGradient && this.state.pageConfig.backgroundGradient) {
            bodyWrapperStyle.backgroundImage = this.state.pageConfig.backgroundGradient;
            hasBgImage = true;
        } else if(this.state.pageConfig.hasBackgroundImage) {
            if (this.state.pageConfig.pageBase64Image || this.state.pageConfig.backgroundImage) {
                bodyWrapperStyle.backgroundImage = `url(${this.state.pageConfig.pageBase64Image || `/files/pages/page-${this.state.pageId}/${this.state.pageConfig.backgroundImage})`}`;
                hasBgImage = true;
            }
        }

        if (hasBgImage) {
            bodyWrapperStyle.backgroundPosition = "center";
            if (this.state.pageConfig.hasBackgroundRepeat) {
                bodyWrapperStyle.backgroundRepeat = "repeat";
            } else {
                bodyWrapperStyle.backgroundRepeat = "no-repeat";
            }

            if (this.state.pageConfig.hasBackgroundStretch) {
                bodyWrapperStyle.backgroundSize = "cover"
            } else {
                bodyWrapperStyle.backgroundSize = "auto"
            }
        }

        return (
            <React.Fragment>
                {this.state.googleFonts.length ? <GoogleFontLoader fonts={this.state.googleFonts} /> : ""}
                <Helmet>
                    <title>{this.state.editing ? "Edit Page" : "Add Page"}</title>
                </Helmet>
                <div className={classes.bodyWrapper} style={{...bodyWrapperStyle}}>
                    <MuiThemeProvider theme={this.muiTheme}>
                        {this.state.showBoxOptions &&
                        <ViewBoxOptions
                            defaultTheme={this.props.defaultTheme}
                            onClose={() => {
                                this.setState({ showBoxOptions: false })
                            }}
                            onSave={(item) => {
                                this.saveBox(item);
                            }}
                            pageOptions={{
                                pageId: this.state.pageId
                            }}
                            fontFamilies={fontsList}
                            item={this.state.boxEditorProps.item}
                            showModal={this.state.showBoxOptions}/>}

                        <ViewPageOptions
                            open={this.state.showPageOptionsModal}
                            control={this.props.control}
                            data={this.state.pageConfig}
                            editing={this.state.editing}
                            defaultTheme={this.props.defaultTheme}
                            closePageOptionsModal={this.closePageOptionsModal.bind(this)}
                            onSave={(data) => {
                                const pageConfig = {...this.state.pageConfig, ...data};
                                this.setState({pageConfig: pageConfig});
                            }}
                            fontFamilies={fontsList}
                            fontSizes={this.fontSizes}
                            handleFontSize={this.handleFontSize}
                            handleFontFamily={this.handleFontFamily}
                        />

                        {this.state.livePreview ? <ViewPagesPreview
                            items={this.state.items}
                            control={this.props.control}
                            services={this.props.services}
                            pageConfig={this.state.pageConfig}
                            hideBackground={true}
                            isLivePreview={true}
                        /> : ""}
                        {!this.state.livePreview ? <div className={classes.gridLayout}>
                            <div style={{
                                    flexGrow: 1,
                                    fontFamily: this.state.fontFamily,
                                    color: this.state.textColor,
                                    paddingBottom: "55px",
                                }}>
                                {this.state.items.length ? <ResponsiveReactGridLayout
                                    style={{
                                        fontFamily: this.state.fontFamily, color: this.state.textColor,
                                    }}
                                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                                    layouts={this.state.pageConfig.layouts}
                                    margin={this.state.pageConfig.layoutBoxSpacing}
                                    containerPadding={this.state.pageConfig.layoutBoxPadding}
                                    draggableHandle=".MyDragHandleClassName"
                                    onLayoutChange={(layout, layouts) => {
                                        return this.onLayoutChange(layout, layouts);
                                    }}
                                    compactType="vertical"
                                >
                                    {_.map(this.state.items, (el) => this.createElement(el))}
                                </ResponsiveReactGridLayout> : ""}
                            </div>
                        </div> : ""}
                        <div className={classes.bottomPane} style={{
                            backgroundColor: this.props.defaultTheme?.background?.paper
                        }}>
                            <div>
                                <Tooltip title="Add a new box">
                                    <IconButton onClick={this.onAddItem.bind(this)}>
                                        <Avatar style={{
                                            backgroundColor: this.props.defaultTheme?.primary?.main,
                                            color: this.props.defaultTheme?.primary?.contrastText
                                        }}>
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
                                        <Avatar style={{
                                            backgroundColor: this.props.defaultTheme?.primary?.main,
                                            color: this.props.defaultTheme?.primary?.contrastText
                                        }}>
                                            <PostAdd/>
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title={this.state.livePreview ? "Stop Live Preview Mode" : "Turn on Live Preview Mode"}>
                                    <IconButton onClick={async () => {
                                        await this.setAsyncState(prevState => {
                                            return {livePreview: !prevState.livePreview}
                                        })
                                    }}>
                                        <Avatar style={{
                                            backgroundColor: this.props.defaultTheme?.primary?.main,
                                            color: this.props.defaultTheme?.primary?.contrastText
                                        }}>
                                            {this.state.livePreview ? <StopScreenShare/> : <ScreenShare/>}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={"Open the preview page"}>
                                    <IconButton onClick={() => {
                                        window.open(`/pages/preview/${this.state.pageId}`)
                                    }}>
                                        <Avatar style={{
                                            backgroundColor: this.props?.defaultTheme?.primary?.main,
                                            color: this.props?.defaultTheme?.primary?.contrastText
                                        }}>
                                            <Visibility/>
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={this.state.isTemplate ? "Template Options" : "Page Options"}>
                                    <IconButton onClick={this.openPageOptionsModal.bind(this)}>
                                        <Avatar style={{
                                            backgroundColor: this.props.defaultTheme?.primary?.main,
                                            color: this.props.defaultTheme?.primary?.contrastText
                                        }}>
                                            <Settings/>
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className={classes.bottomPaneButtons}>
                                <Button color="primary" onClick={this.savePage.bind(this)}>Save</Button>
                                <Button onClick={this.handleDiscard.bind(this)} color="danger">Discard</Button>
                            </div>
                        </div>
                        <Modal
                            showModal={this.state.showDiscardModal}
                            name="discardModal"
                            title={this.state.modalTitle}
                            modalSize="small"
                            content={<Typography>All changes will be lost. Are you sure you want to
                                continue?</Typography>}
                            confirmButton={{
                                callback: () => this.props.history.push("/pages"), label: "Ok",
                            }}
                            closeButton={{callback: () => {
                                this.closeDiscardModal()
                                }, label: "Cancel",
                            }}
                        />
                        <Modal
                            showModal={this.state.showDeleteTemplateBoxModal}
                            {...this.state.deleteTemplateBoxModal}
                        />
                        <Modal
                            showModal={this.state.showDeleteBoxModal}
                            {...this.state.deleteBoxModal}
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
            </React.Fragment>);
    }
}

export default withStyles(styles)(ViewPagesEditor);

ViewPagesEditor.propTypes = {
    classes: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    control: PropTypes.object,
    services: PropTypes.object,
    defaultTheme: PropTypes.object
};