import React, {Suspense} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
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
const ResponsiveReactGridLayout = WidthProvider(Responsive, {measureBeforeMount: true});

class ViewPagesEditor extends React.PureComponent {

    state = {
        pageId: 0,
        boxes: [],

        title: "",
        link: "",
        isHome: false,
        active: false,
        isTemplate: false,
        templateId: 0,

        seoTitle: "",
        description: "",
        useWebsiteTitle: false,

        hasBackgroundImage: false,
        hasBackgroundRepeat: false,
        hasBackgroundStretch: false,

        backgroundImageFile: "",
        hasBackgroundColor: false,
        hasBackgroundGradient: false,
        backgroundColor: "",
        backgroundGradient: "",
        textColor: "#000000",
        fontFamily: "Roboto",
        fontUnit: "px",
        fontSize: 11,
        categories: [],

        layoutBoxSpacing: [10, 10],
        layoutBoxPadding: {
            lg: [0, 0],
            md: [0, 0],
            sm: [0, 0],
            xs: [0, 0],
            xxs: [0, 0],
        },
        layouts: {},

        delBoxIndex: 0,
        boxEditorProps: {},

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

        uploadingMessage: ""
    };

    pageKeys = [
        'pageId',
        'title',
        'link',
        'isHome',
        'active',
        'isTemplate',
        'templateId',
    ];

    pageConfigKeys = [
        'seoTitle',
        'useWebsiteTitle',
        'description',
        'hasBackgroundImage',
        'hasBackgroundRepeat',
        'hasBackgroundStretch',
        'hasBackgroundColor',
        'hasBackgroundGradient',
        'backgroundImageFile',
        'backgroundColor',
        'backgroundGradient',
        'textColor',
        'fontFamily',
        'fontSize',
        'categories',
        'layoutBoxSpacing',
        'layoutBoxPadding',
    ];

    fontSizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].map(n => {return {label: `${n}`, value: n}});

    muiTheme = {};

    setUsedGoogleFonts() {
        const fonts = [];

        if (this.state.fontFamily && this.state.fontFamily.length) {
            fonts.push({font: this.state.fontFamily});
        }

        if (this.state.boxes && this.state.boxes.length) {
            this.state.boxes.map((box) => {
                if (box.fontFamily && !fonts.some(f => f.font ===box.fontFamily)) {
                    fonts.push({font:box.fontFamily});
                }
                return box;
            });
        }
        this.setState({
            googleFonts: fonts
        })
    }

    updateBoxList(boxes) {
        this.setState({
            newBoxList: boxes
        })
    }

    async getPageDetails(pageId, fromTemplate) {
        let currentPage = await this.props.control.get({id: parseInt(pageId)});
        let {pageConfig, boxes, title, link, isHome, active, isTemplate, templateId, categories} = currentPage;

        boxes = boxes.map((box, index) => {
            return {
                ...JSON.parse(box.data),//GOD please forgive me
                i: String(index),
                id: box.id,
                title: box.title,
                module: box.module,
                x: box.PageToBox.x,
                y: box.PageToBox.y,
                moduleOptions: JSON.parse(box.moduleOptions),
            }
        })

        const statePayload = {
            ...pageConfig,//GOD please forgive me
            pageId: pageId,
            title: title,
            link: link,
            isHome: !!isHome,
            active: !!active,
            isTemplate: !!isTemplate,
            templateId,
            categories,
            boxes
        };

        if (fromTemplate && boxes && boxes.length) {
            boxes = boxes.map((box) => {
                return {
                    ...box, templateId: pageId, resizeHandles: []
                }
            });
            statePayload['boxes'] = boxes;
        }

        await this.setAsyncState(statePayload);

        this.setUsedGoogleFonts();
    }

    getPageOptions() {
        return _.pick(this.state, [...this.pageKeys, ...this.pageConfigKeys])
    }

    async componentDidMount() {
        const editing = this.state.editing;

        if (editing) {
            const pageId = Number(this.props.location.pathObject[2]);
            await this.getPageDetails(pageId);
        } else {
            if (this.props.location?.state?.templateMode) {
                this.setState({
                    isTemplate: this.props.location.state.templateMode
                });
            }
        }
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    modals = {
        deleteBoxModal: {
            name: "deleteBoxModal",
            title: "Confirm Delete Box",
            content: "Are you sure you want to delete this box?",
            modalSize: "small",
            closeButton: {
                callback: () => {
                    this.setState({showDeleteBoxModal: false});
                },
                label: "Cancel",
            },
            confirmButton: {
                show: true,
                callback: () => {
                    this.setState({showDeleteBoxModal: false});
                    this.deleteBox(this.state.delBoxIndex);
                },
                label: "Delete",
            },
        },
        deleteTemplateBoxModal: {
            name: "deleteTemplateBoxModal",
            title: "Confirm Delete Template Box",
            content: <div>This box is from a template. The original box will not be deleted. Are you sure you want to
                delete it?</div>,
            closeButton: {
                callback: () => {
                    this.setState({showDeleteTemplateBoxModal: false});
                },
                label: "Cancel",
            },
            confirmButton: {
                show: true, callback: () => {
                    this.setState({showDeleteTemplateBoxModal: false});
                    this.deleteBox(this.state.delBoxIndex);
                },
                label: "Delete Anyway",
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
                show: false,
                callback: () => {
                    if (this.state.newBoxList && this.state.newBoxList.length > 0) {
                        this.setState({showBoxesFromTemplate: false});
                        const boxes = [...this.state.boxes];
                        this.setState({
                            boxes: [...boxes, ...this.state.newBoxList]
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
                },
                label: "Add",
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

        let boxStyle = {};

        if (el.scrollbars) {
            boxStyle.scrollbars = el.scrollbars;
        }

        if (el.hasFontFamily) {
            boxStyle.fontFamily = el.fontFamily;
        }

        if (el.hasTextColor) {
            boxStyle.color = el.textColor;
        }

        if(el.hasBackgroundImage) {
            if (el.backgroundImageString) {
                boxStyle.backgroundImage = `url(${el.backgroundImageString})`;
            } else {
                boxStyle.backgroundImage = `url(/files/pages/page-${el.templateId ? el.templateId : this.state.pageId}/box-${i}/${el.backgroundImage})`;
            }

            if (el.backgroundImage && el.backgroundImage.indexOf("__delete__") === 0) {
                el.backgroundImageString = "";
                boxStyle.backgroundImage = "";
            }

            boxStyle.backgroundRepeat = el.hasBackgroundRepeat ? "repeat" : "no-repeat";

            if (el.hasBackgroundStretch) {
                boxStyle.backgroundSize = "cover";
            } else {
                boxStyle.backgroundSize = "auto";
            }
        }
        
        if (el.hasBackgroundGradient) {
            boxStyle.backgroundImage = el.backgroundGradient;
        }

        if (el.hasBackgroundColor) {
            boxStyle.backgroundColor = el.backgroundColor;
        }

        if (el.hasBorderColor) {
            boxStyle.borderColor = el.borderColor;
        }

        if (Number(el.borderWidth)) {
            boxStyle.borderWidth = el.borderWidth;
        } else {
            boxStyle.borderWidth = 1;
            boxStyle.borderStyle = "dashed";
            boxStyle.borderColor = "#CCC";
        }

        if (el.borderRadius) {
            boxStyle.borderRadius = el.borderRadius;
        }

        //adding default box styles

        const moduleStyle = {};

        if (el.hasBackgroundColor) {
            moduleStyle.backgroundColor = el.backgroundColor;
        } else if (el.hasBackgroundImage) {
            moduleStyle.backgroundImage = `url(/files/pages/page-${el.templateId ? el.templateId : this.state.pageId}/box-${i}/${el.backgroundImage})`;
            moduleStyle.backgroundRepeat = el.hasBackgroundRepeat ? "repeat" : "no-repeat";
            moduleStyle.backgroundSize = el.hasBackgroundStretch ? "cover" : "auto";
        } else if (el.hasBackgroundGradient) {
            moduleStyle.backgroundImage = el.backgroundGradient;
        }

        if (el.hasBorderColor && Number(el.borderWidth)) {
            moduleStyle.borderColor = el.borderColor;
            moduleStyle.borderStyle = "solid";
            moduleStyle.borderWidth = el.borderWidth + "px";
        }

        if (Number(el.borderRadius)) {
            moduleStyle.borderRadius = el.borderRadius;
        }

        if (el.hasFontSize) {
            moduleStyle.fontSize = `${el.fontSize}${this.state.fontUnit}`;
            moduleStyle.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
        } else if (this.state?.fontSize) {
            moduleStyle.fontSize = `${this.state.fontSize}${this.state.fontUnit}`;
            moduleStyle.lineHeight = `${this.state.fontSize}${this.state.fontUnit}`;
        }

        if (el.hasFontFamily) {
            moduleStyle.fontFamily = el.fontFamily;
        } else if (this.state?.fontFamily) {
            moduleStyle.fontFamily = this.state.fontFamily;
        }

        if (el.hasTextColor) {
            moduleStyle.color = el.textColor;
        } else if (this.state?.textColor) {
            moduleStyle.textColor = this.state.textColor;
        }

        if (el.scrollbars) {
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
            <div key={i} data-grid={el} style={boxStyle}>
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
                    <div>
                        <Tooltip title="Show box properties">
                            <IconButton onClick={() => {
                                this.handleBoxOptions(i)
                            }}><Avatar style={{
                                    backgroundColor: this.props.defaultTheme.secondary.main,
                                    color: this.props.defaultTheme.secondary.contrastText
                                }}><Edit/></Avatar>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Make a copy of this box">
                            <IconButton onClick={() => {
                                this.onDuplicate(el.i)
                            }}>
                                <Avatar style={{
                                    backgroundColor: this.props.defaultTheme?.primary?.main,
                                    color: this.props.defaultTheme?.primary?.contrastText
                                }}><FileCopy/></Avatar>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete this box">
                            <IconButton onClick={() => { this.showDeleteBoxModal(el); }}>
                                <Avatar style={{
                                    backgroundColor: this.props.defaultTheme.error.main,
                                    color: this.props.defaultTheme.error.contrastText
                                }}><DeleteForever/></Avatar>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.boxLazyModuleWrapper}>
                    {el.module && LazyModule ? (
                        <Suspense fallback={loadingFallback}>
                            <LazyModule
                                key={`box-${el.i}`}
                                boxId={el.cloneId ? el.cloneId : Number(el.id || 0)}
                                pageId={this.state.pageId}
                                moduleOptions={el.moduleOptions}
                                style={{style: moduleStyle}}
                                defaultTheme={this.props.defaultTheme}
                                pageOptions={{ pageId: this.state.pageId }}
                                control={this.props.control}
                                services={this.props.services}
                            />
                        </Suspense>
                    ) : ""}
                </div>
            </div>);
    }

    saveModuleOptions = async (passedId, data) => {
        let boxes = [...this.state.boxes];

        let box = this.getBoxById(passedId);

       box.moduleOptions = {data: data};

        let boxIndex = boxes.findIndex((box) => Number(box.i) === Number(passedId));

        boxes[boxIndex] =box;

        await this.setAsyncState({boxes});
    };

    async onDuplicate(id) {
        try {
            const existingBox = this.getBoxById(id);

            let newId = 0;

            this.state.boxes.map((box) => {
                newId = Number(box.i) > Number(newId) ? Number(box.i) : newId;
                return box;
            });

            newId++;
            let boxes = this.state.boxes;

            const targetBox = Object.assign({}, existingBox);
            targetBox.i = newId + "";
            targetBox.cloneId = existingBox.id;
            targetBox.files = existingBox.files;
            targetBox.x = 0;
            targetBox.y = Infinity;


            //TODO copy from the service
            if (!targetBox.backgroundImageFile && existingBox.backgroundImage) {
                const bgResponse = await fetch(`/files/pages/page-${existingBox.templateId ? existingBox.templateId : this.state.pageId}/box-${id}/${existingBox.backgroundImage}`);
                const bgBlob = await bgResponse.blob();
                targetBox.backgroundImageFile = new File([bgBlob], existingBox.backgroundImage);
                targetBox.backgroundImageString = await Promise.all([imageHelper.toBase64(targetBox.backgroundImageFile)]);
            }

            boxes.push(targetBox);

            this.setState({
                boxes: boxes
            });
            window.scrollTo(0, document.body.scrollHeight);
        } catch (err) {
            console.log(err);
        }
    }

    async onAddBox() {
        let newId = 0;

        try {
            this.state.boxes.map((box) => {
                newId = Number(box.i) > Number(newId) ? Number(box.i) : newId;
                return box;
            });

            newId++;

            const box = {
                newBox: true,
                title: "New Box",
                i: String(newId),
                x: 0,
                y: Infinity, // puts it at the bottom
                w: 12,
                h: 200 / (this.state.layoutBoxSpacing[0] || 1),
            };

            this.setState({
                boxEditorProps: box,
                showBoxOptions: true
            });

            window.scrollTo(0, document.querySelector('.bodyWrapper').scrollHeight);
        } catch (err) {
            console.log(err);
        }
    }

    showDeleteBoxModal(el) {
        if (el.templateId) {
            this.setState({
                showDeleteTemplateBoxModal: true,
                delBoxIndex: el.i
            })
            return
        }
        this.setState({
            showDeleteBoxModal: true,
            delBoxIndex: el.i
        });
    }

    getBoxById = (id) => {
        return this.state.boxes.find((box) => Number(box.id) === Number(id) || Number(box.i) === Number(id));
    };

    onLayoutChange = (layout, layouts) => {
        try {
            let newBoxes = layout.map((box) => {
                let oldBox = this.getBoxById(box.i);
                oldBox.x =box.x;
                oldBox.y =box.y;
                oldBox.w =box.w;
                oldBox.h =box.h;
                return oldBox;
            });

            const pageConfig = this.state;
            pageConfig.layouts = layouts;

            this.setState({boxes: newBoxes, pageConfig});
        } catch (err) {
            console.log(err);
        }
    };

    deleteBox(boxIndex) {
        this.setState({
            boxes: _.reject(this.state.boxes, {i: boxIndex}),
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
        const box = this.getBoxById(id);

        if (box.templateId) {
            this.setState({
                templateEditId: box.templateId,
                showTemplateWarning: true
            })
        } else {
            this.setState({
                showBoxOptions: true,
                boxEditorProps: box
            });
        }
    }

    handleDiscard () {
        this.setState({showDiscardModal: true});
    };

    /*createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme
        });
    };*/

    async saveBox(data) {
        const boxes = this.state.boxes;

        if (data.newBox) {
            delete data.newBox;
            boxes.push(data);
        } else {
            const boxIndex = boxes.findIndex((box) => Number(data.i) === Number(box.i));
            boxes[boxIndex] = data;
        }

        await this.setAsyncState({
            boxes,
            showBoxOptions: false
        });

        this.setUsedGoogleFonts();
    }

    async convertBoxes() {
        if(this.state.boxes) {
            const boxes = [...this.state.boxes];
            return boxes.map((box, index) => {

                return {
                    id: box.id || 0,
                    title: box.title,
                    module: box.module,
                    moduleOptions: box.moduleOptions,
                    data: {

                    },
                };
            });
        } else {
            return [];
        }
    }

    async savePage() {
        const pageProps = _.pick(this.state, this.pageKeys);
        const pageConfig = _.pick(this.state, this.pageConfigKeys);

        const payload = {
            pageProps,
            pageConfig,
            boxes: this.state.boxes.map(box => {
                return {
                    id: box.id || 0,
                    title: box.title,
                    module: box.module,
                    moduleOptions: box.moduleOptions,
                    data: _.omit(box, ['id', 'title', 'module', 'moduleOptions'])
                }
            }),
            uploadProgress: (evt) => {
                //TODO calculate all uploads from the controller
                this.setState({
                    showUploadingMessage: true,
                    uploadingMessage: `Uploaded ${Math.floor((evt.loaded / evt.total) * 100)}%`
                });
            }
        };

        if (this.state.editing) {

            await this.props.control.edit(payload);

            this.setState({
                uploadingMessage: '',
                showUploadingMessage: false
            });

            this.setState({
                showSavedMessage: true
            });

            setTimeout(() => {
                this.setState({
                    showSavedMessage: false
                })
            }, 3000);
        } else {
            const pageData = await this.props.control.add(payload);
            this.props.history.push(`/pages/edit/${pageData.pageId}`);
        }
    }

    render() {
        const classes = this.props.classes;

        const bodyWrapperStyle = {};
        let hasBgImage = false;

        if (this.state.backgroundColor && this.state.hasBackgroundColor) {
            bodyWrapperStyle.backgroundColor = this.state.backgroundColor;
            bodyWrapperStyle.backgroundImage = 'none';
        }

        if (this.state.hasBackgroundGradient && this.state.backgroundGradient) {
            bodyWrapperStyle.backgroundImage = this.state.backgroundGradient;
            hasBgImage = true;
        } else if(this.state.hasBackgroundImage) {
            if (this.state.pageBase64Image || this.state.backgroundImage) {
                bodyWrapperStyle.backgroundImage = `url(${this.state.pageBase64Image || `/files/pages/page-${this.state.pageId}/${this.state.backgroundImage})`}`;
                hasBgImage = true;
            }
        }

        if (hasBgImage) {
            bodyWrapperStyle.backgroundPosition = "center";
            if (this.state.hasBackgroundRepeat) {
                bodyWrapperStyle.backgroundRepeat = "repeat";
            } else {
                bodyWrapperStyle.backgroundRepeat = "no-repeat";
            }

            if (this.state.hasBackgroundStretch) {
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
                    {this.state.showBoxOptions &&
                        <ViewBoxOptions
                            defaultTheme={this.props.defaultTheme}
                            onClose={() => {
                                this.setState({ showBoxOptions: false })
                            }}
                            onSave={(box) => {
                                this.saveBox(box);
                            }}
                            pageOptions={{
                                pageId: this.state.pageId,
                                layoutBoxSpacing: this.state.layoutBoxSpacing
                            }}
                            fontFamilies={fontsList}
                            fontSizes={this.fontSizes}
                            box={this.state.boxEditorProps}
                            showModal={this.state.showBoxOptions}
                            services={this.props.services}
                        />
                    }

                    { this.state.showPageOptionsModal && <ViewPageOptions
                        open={this.state.showPageOptionsModal}
                        control={this.props.control}
                        data={this.getPageOptions()}
                        editing={this.state.editing}
                        defaultTheme={this.props.defaultTheme}
                        closePageOptionsModal={this.closePageOptionsModal.bind(this)}
                        onSave={async (data, async) => {
                            async ? await this.setAsyncState(data) : this.setState(data);
                        }}
                        fontFamilies={fontsList}
                        fontSizes={this.fontSizes}
                        setUsedGoogleFonts={() => this.setUsedGoogleFonts()}
                    /> }

                    {this.state.livePreview ? <ViewPagesPreview
                        boxes={this.state.boxes}
                        control={this.props.control}
                        services={this.props.services}
                        pageConfig={this.state}
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
                            {this.state.boxes.length ? <ResponsiveReactGridLayout
                                style={{
                                    fontFamily: this.state.fontFamily, color: this.state.textColor,
                                }}
                                cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
                                layouts={this.state.layouts}
                                rowHeight={1}
                                margin={this.state.layoutBoxSpacing}
                                containerPadding={this.state.layoutBoxPadding}
                                draggableHandle=".MyDragHandleClassName"
                                onLayoutChange={(layout, layouts) => {
                                    return this.onLayoutChange(layout, layouts);
                                }}
                                compactType="vertical"
                            >
                                {_.map(this.state.boxes, (el) => this.createElement(el))}
                            </ResponsiveReactGridLayout> : ""}
                        </div>
                    </div> : ""}
                    <div className={classes.bottomPane} style={{
                        backgroundColor: this.props.defaultTheme?.background?.paper
                    }}>
                        <div>
                            <Tooltip title="Add a new box">
                                <IconButton onClick={this.onAddBox.bind(this)}>
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
                        {...this.modals.deleteTemplateBoxModal}
                    />
                    <Modal
                        showModal={this.state.showDeleteBoxModal}
                        {...this.modals.deleteBoxModal}
                    />
                    <Modal
                        showModal={this.state.showBoxesFromTemplate}
                        {...this.modals.boxesFromTemplate}
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
                    <Snackbar
                        open={this.state.showUploadingMessage}
                        place="tc"
                        color="info"
                        message={this.state.uploadingMessage}
                    />
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