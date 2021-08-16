import React, {Component, Suspense} from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

import {Helmet} from "react-helmet";

import styles from "assets/jss/clear-crm/views/dashboard";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {AddCircle, DeleteForever, Edit, OpenWith} from "@material-ui/icons";
import _ from "lodash";
import {Responsive, WidthProvider} from "react-grid-layout";
import MoreMenu from "../../components/MoreMenu/MoreMenu";
import ViewBoxEditor from "./ViewBoxEditor";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewDashboard extends Component {
    static defaultProps = {
        className: "layout",
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 1,
        transformScale: 1,
    };
    state = {
        items: [],
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
        bgColor: "",
        pageBase64Image: false,
        backgroundImage: "",
        backgroundImageFile: "",
        fontSize: 11,
        textColor: "#000000",
        fontFamily: "Arial",
        fontUnit: "px",
        pageBackgroundRepeat: false,
        pageBackgroundStretch: false,
        pageBackgroundGradient: false,
        pageTransitionPadding: "",
        backgroundRepeat: false,
        backgroundStretch: false,
        boxEditorProps: {
            item: {},
        },
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {

    }

    onAddItem(evt) {
        evt.preventDefault();
        evt.stopPropagation();
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

            this.setState({
                // Add a new item. It must have a unique key!
                items: items,
            });
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

    saveBox = (params) => {
        let box = params;

        let items = this.state.items;
        let boxIndex = items.findIndex((item) => item.i === this.state.itemEditId);

        items[boxIndex] = box;

        this.setAsyncState({
            items,
        });
    };

    handleEditItem = async (id) => {
        await this.setAsyncState({
            itemEditId: id,
        });
        const item = this.getItemById(id);

        await this.setAsyncState({
            boxEditorProps: {
                item,
            },
            showEditMenu: !this.state.showEditMenu,
            pageTransitionPadding: "300px",
        });
    };

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
            itemStyle.backgroundImage = `url(/files/pages/page-${this.state.page_id}/box-${i}/${el.backgroundImage})`;
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
                icon: (
                    <DeleteForever
                        style={{ color: this.props.defaultTheme.secondary.main }}
                    />
                ),
                name: "Delete Item",
            },
            {
                callback: () => {
                    this.handleEditItem(el.i);
                },
                icon: <Edit style={{ color: this.props.defaultTheme.primary.main }} />,
                name: "Edit Item",
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
                                    handleSave={(id, data) => {
                                        this.saveModuleOptions(id, data);
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

    render() {
        return (
            <div>
                <Helmet>
                    <title>Dashboard</title>
                </Helmet>
                <div
                    className={this.props.classes.bodyWrapper}
                    style={{
                        marginTop: "60px",
                        paddingBottom: "60px",
                        paddingLeft: this.state.pageTransitionPadding,
                    }}
                >
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
                    <div>
                        <Tooltip title="Add a new box">
                            <IconButton onClick={(evt) => this.onAddItem(evt)}>
                                <AddCircle
                                    className={this.props.classes.rightSideIcon}
                                    color="primary"
                                />{" "}
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div
                        style={{
                            flexGrow: 1,
                            backgroundImage: `url(${
                                this.state.pageBase64Image ||
                                `/files/pages/page-${this.state.page_id}/${this.state.backgroundImage})`
                            }`,
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
                            paddingBottom: "55px",
                        }}
                    >
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
                        </ResponsiveReactGridLayout>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ViewDashboard);

ViewDashboard.propTypes = {
    defaultTheme: PropTypes.object,
    classes: PropTypes.object,
}