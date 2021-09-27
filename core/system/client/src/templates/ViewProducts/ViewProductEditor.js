import React  from "react";
import {
    MuiThemeProvider,
    withStyles,
} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/productEdit.js";
import {
    Settings,
    InfoSharp, StopScreenShare, ScreenShare, Visibility, CheckBoxOutlineBlank, CheckBox
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import MoreMenu from "components/MoreMenu/MoreMenu.js";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import Snackbar from "components/Snackbar/Snackbar.js";

import { Helmet } from "react-helmet";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Tooltip from "@material-ui/core/Tooltip";

// for speed dial
import Switch from "@material-ui/core/Switch";

// for the dropdown inside each field
import {AppBar, Checkbox, Tab, Tabs, TextField} from "@material-ui/core";
import Autocomplete, {
    createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import Modal from "../../components/Modal/Modal";
import PropTypes from "prop-types";
import {Editor} from "@tinymce/tinymce-react";
import CustomDateRangePicker from "../../components/CustomDateRangePicker/CustomDateRangePicker";
import {DropzoneArea} from "material-ui-dropzone";
import PhotosGallery from "../../components/PhotosGallery/PhotosGallery";
import ProductPreview from "./ViewProductPreview";

const filter = createFilterOptions();

class ViewProductEditor extends React.PureComponent {
    static defaultProps = {
        className: "layout",
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 1,
        transformScale: 1,
    };

    state = {
        showDiscardModal: false,
        showSavedMessage: false,
        showProductOptionsModal: this.props.location.pathname.indexOf("edit") === -1,
        editing: this.props.location.pathname.indexOf("edit") > -1,
        editProduct: "",
        speedDialState: false,
        showDropZone: false,
        livePreview: false,
        activeTab: 0,
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
        currencyList: [{
            id: 1,
            name: "USD"
        },{
            id: 2,
            name: "CAD"
        }],
        categories: [],
        localities: [],
        labels: [],
        title: "",
        description: "",
        flatCategories: [],
        imageSources: [],
        currentCategory: "",
        currentLocality: "",
        selectedLabels: [],
        active: false,
        availability: ["", ""],
        unavailability: ["", ""],
        discardModal: {
            name: "discardModal",
            title: "Discard Modal",
            content: "Are you sure you want to proceed ?",
            closeButton: {
                callback: () => {
                    this.setState({ showDiscardModal: false });
                },
                label: "Cancel",
            },
            confirmButton: {
                callback: () => {
                    this.props.history.push("/products");
                },
                label: "Proceed",
            },
        },
    };

    muiTheme = {};
    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        const tabUrl = this.props.location.pathname.split('/')
        if (tabUrl.length === 4) {
            this.setState({activeTab: 0})
        } else if (tabUrl[4] === "availability") {
            this.setState({activeTab: 1})
        } else {
            this.setState({activeTab: 2})
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
            await this.setAsyncState({categories});

            await this.getAllCategories();
        }

        let localityFromStorage = await this.props.control.listLocalities();

        if (localityFromStorage) {
            localityFromStorage = localityFromStorage.map((locality) => ({
                id: locality.id,
                title: locality.title
            }));

            await this.setAsyncState({localities: localityFromStorage});
        }

        let labelsFromStorage = await this.props.control.listLabels({active: 1});

        if(labelsFromStorage) {
            await this.setAsyncState({labels: labelsFromStorage});
        }

        let editing = this.state.editing;
        let product_id = this.props.location.pathObject[2];
        if(editing) {
            await this.fetchAndSet(product_id);
        }
    }

    async fetchAndSet(id) {
        const productDetails = await this.props.control.get({id: id})
        await this.setAsyncState({
            editProduct: productDetails.id,
            title: productDetails.title,
            description: productDetails.description,
            active: productDetails.active,
            availability: productDetails.availability ? productDetails.availability : ["", ""],
            unavailability: productDetails.unavailability ? productDetails.unavailability : ["", ""],
            priceList: productDetails.priceList
        })

        if(productDetails.categoryId) {
            await this.setAsyncState({
                currentCategory: this.getCategoryItem(productDetails.categoryId),
            })
        }

        if(productDetails.localityId) {
            await this.setAsyncState({
                currentLocality: this.getLocalityItem(productDetails.localityId),
            })
        }

        if(productDetails.selectedLabels) {
            const labelList = this.state.labels.filter(label => productDetails.selectedLabels.indexOf(label.id) > -1);
            await this.setAsyncState({
                selectedLabels: labelList
            })
        }

        if(productDetails.imageSources) {
            const imageSources = productDetails.imageSources.map(image => ({
                ...image,
                file: `/files/products/${id}/${image.image_id}.${image.extension}`,
                width: 4,
                height: 3
            }));
            await this.setAsyncState({
                imageSources: imageSources
            })
        }
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

    getCategoriesNested(id) {
        let link = this.state.categories.find((el) => el.id === id);
        let result = link.label || "";
        if (link && link.parentid) {
            result = this.getCategoriesNested(link.parentid) + "/" + result;
        }
        return result;
    }

    prepareProductProperties() {
        return {
            title: this.state.title,
            description: this.state.description,
            active: this.state.active,
            categoryId: this.state.currentCategory && this.state.currentCategory.id,
            localityId: this.state.currentLocality && this.state.currentLocality.id,
            availability: this.state.availability,
            unavailability: this.state.unavailability,
            imageSources: this.state.imageSources,
            priceList: this.state.priceList,
            labelList: this.state.selectedLabels,
        }
    }

    handleInputChange = async (event) => {
        if(event.target.id) {
            this.setAsyncState({
                [event.target.id]: event.target.value
            })
        }
    };

    saveProduct = async () => {
        let productProperties = this.prepareProductProperties();

        if (this.state.editing) {
            await this.props.control.edit({ ...productProperties, id: this.state.editProduct });

            this.setState({
                showSavedMessage: true
            });

            setTimeout(async () => {
                this.setState({
                    showSavedMessage: false
                })
                await this.fetchAndSet(this.state.editProduct);
            }, 3000);

        } else {
            const product = await this.props.control.add(productProperties);

            if(product) {
                this.props.history.push(`/products/edit/${product.id}`);
            }
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

    getCategoryItem(id) {
        return this.state.categories[
            this.state.categories.findIndex((category) => {
                return category.id === id;
            })
            ];
    }

    getLocalityItem(id) {
        return this.state.localities[
            this.state.localities.findIndex((locality) => {
                return locality.id === id;
            })
            ];
    }

    handleUploadedImage = async (event) => {
        let temporaryImageSources = [...this.state.imageSources];

        if (event.length) {
            await Promise.all(
                event.map(async (file) => {
                    let baseFile = await this.toBase64(file)
                    if (!temporaryImageSources.includes(file)) {
                        temporaryImageSources.push({path: file.path, title: file.title, file: baseFile, fileItem: file, fileBase64: baseFile, width: 4, height: 3, active: true});
                    }
                    return file;
                })
            );
        }

        await this.setAsyncState({ temporaryImageSources });
    };

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    getPriceFormat(price) {
        return this.state.currencyList.find(c => c.id === price.currency).name;
    }
    handleTab(data){
        this.props.history.push(`/${this.props.location.pathObject.slice(0,3).join('/')}${data}`)
    }

    render() {
        const productActions = [
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
            },
            {
                callback: () => {
                    window.open(
                        `/products/preview/${this.state.editProduct}`
                    );
                },
                icon: <Visibility
                    className={this.props.classes.rightSideIcon}
                    color="primary"
                />,
                name: "Preview product"
            },
        ];
        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.state.editing ? "Edit Product" : "Add Product"}</title>
                </Helmet>
                    <MuiThemeProvider theme={this.muiTheme}>
                        <div>
                            <div
                                style={{
                                    flexGrow: 1,
                                    paddingBottom: "55px",
                                    marginTop: "60px",
                                }}
                            >
                                {this.state.livePreview ? <ProductPreview isLivePreview={true} {...this.state} control={this.props.control}/> :
                                    <React.Fragment>
                                        <div
                                            style={{
                                                paddingBottom: "130px",
                                                paddingLeft: "10px",
                                                paddingRight: "10px",
                                            }}
                                        >
                                            <div className={this.props.classes.productTitleInputWrapper}>
                                                <CustomInput
                                                    labelText={"Product Title"}
                                                    id="title"
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
                                                        value: this.state.title,
                                                        type: "text",
                                                    }}
                                                />
                                            </div>
                                            <AppBar className={this.props.classes.tabsMenu} position="static" color="default">
                                                <Tabs
                                                    value={this.state.activeTab}
                                                    indicatorColor="primary"
                                                    textColor="primary"
                                                    variant="scrollable"
                                                    scrollButtons="auto"
                                                    aria-label="scrollable auto tabs example"
                                                >
                                                    <Tab label="General" onClick={()=>this.handleTab('')} />
                                                    <Tab label="Availability"  onClick={()=>this.handleTab('/availability')} />
                                                    <Tab label="Gallery" onClick={()=>this.handleTab('/gallery')} />
                                                </Tabs>
                                            </AppBar>
                                            <div className={this.props.classes.productOptionsDetails}>
                                                {this.state.activeTab === 0 &&
                                                <React.Fragment>
                                                    <div>
                                                        <Typography>Description</Typography>
                                                        <Editor
                                                            id="editor"
                                                            value={this.state.description}
                                                            init={{
                                                                height: 500,
                                                                menubar: false,
                                                                plugins: [
                                                                    "advlist autolink lists link image charmap print preview anchor",
                                                                    "searchreplace visualblocks code fullscreen",
                                                                    "insertdatetime media table paste code help wordcount",
                                                                ],
                                                                toolbar:
                                                                    "undo redo" +
                                                                    " | formatselect" +
                                                                    " | bold italic forecolor backcolor" +
                                                                    " | alignleft aligncenter alignright alignjustify" +
                                                                    " | bullist numlist outdent indent" +
                                                                    " | removeformat",
                                                                init_instance_callback: function () {
                                                                    var annoyingMessage = document.querySelector(
                                                                        ".tox-notifications-container"
                                                                    );
                                                                    annoyingMessage.style.display = "none";
                                                                },
                                                            }}
                                                            onEditorChange={async (value) =>
                                                                await this.setAsyncState({
                                                                    description: value
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className={this.props.classes.secondColumn}>
                                                        <div className={this.props.classes.autocompleteDropdown}>
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
                                                                getOptionLabel={(option) => option.label || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        className={this.props.classes.textfield}
                                                                        label="Select a category"
                                                                        {...params}
                                                                        variant="outlined"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div className={this.props.classes.autocompleteDropdown}>
                                                            <Autocomplete
                                                                id="localityDropdown"
                                                                onChange={async (event, locality) => await this.setAsyncState({
                                                                    currentLocality: locality,
                                                                })}
                                                                className={this.props.classes.option}
                                                                value={this.state.currentLocality}
                                                                options={this.state.localities}
                                                                autoHighlight
                                                                getOptionLabel={(option) => option.title || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        className={this.props.classes.textfield}
                                                                        label="Select a Locality"
                                                                        {...params}
                                                                        variant="outlined"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div className={this.props.classes.autocompleteDropdown}>
                                                            <Autocomplete
                                                                multiple
                                                                id="labelsDropdown"
                                                                onChange={async (event, label) => await this.setAsyncState({
                                                                    selectedLabels: label,
                                                                })}
                                                                disableCloseOnSelect
                                                                className={this.props.classes.option}
                                                                value={this.state.selectedLabels}
                                                                options={this.state.labels}
                                                                autoHighlight
                                                                getOptionLabel={(option) => option.title || ""}
                                                                renderOption={(props, option) => (
                                                                    <span {...props}>
                                                                <Checkbox
                                                                    icon={<CheckBoxOutlineBlank fontSize={"small"} />}
                                                                    checkedIcon={<CheckBox fontSize={"small"} />}
                                                                    style={{ marginRight: 8 }}
                                                                    checked={option.selected}
                                                                />
                                                                        {props.title}
                                                            </span>
                                                                )}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        className={this.props.classes.textfield}
                                                                        label="Select Labels"
                                                                        {...params}
                                                                        variant="outlined"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Typography gutterBottom>
                                                                Active
                                                                <Tooltip title="Active Product">
                                                                    <Switch
                                                                        checked={this.state.active}
                                                                        value={this.state.active}
                                                                        onChange={() => {
                                                                            this.setState({
                                                                                active: !this.state
                                                                                    .active,
                                                                            });
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <h3>Prices</h3>
                                                            {this.state.priceList && this.state.priceList.length && this.state.priceList.map((price, index) => {
                                                                return (
                                                                    <div key={index} style={{ marginLeft: "-10px" }}>
                                                                        <Checkbox
                                                                            checked={price.active}
                                                                            onChange={async (event, checked) => {
                                                                                const priceList = [...this.state.priceList];
                                                                                const findIndex = priceList.findIndex(p => p.id === price.id);
                                                                                priceList[findIndex].active = checked;
                                                                                await this.setAsyncState({
                                                                                    priceList: priceList,
                                                                                });
                                                                            }}
                                                                        />
                                                                        <span>{price.value + " " + this.getPriceFormat(price)}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                                }
                                                {this.state.activeTab === 1 &&
                                                <React.Fragment>
                                                    <div>
                                                        <Tooltip title="Availability Date Range">
                                                            <CustomDateRangePicker
                                                                labelText={"Availability"}
                                                                value={this.state.availability}
                                                                onChange={ async (value) => await this.setAsyncState({
                                                                    availability: value
                                                                })} />
                                                        </Tooltip>
                                                    </div>
                                                    <div>
                                                        <Tooltip title="Unavailability Date Range">
                                                            <CustomDateRangePicker
                                                                labelText={"Unavailability"}
                                                                value={this.state.unavailability}
                                                                onChange={ async (value) => await this.setAsyncState({
                                                                    unavailability: value
                                                                })} />
                                                        </Tooltip>
                                                    </div>
                                                </React.Fragment>
                                                }
                                                {this.state.activeTab === 2 &&
                                                <div>
                                                    {this.state.showDropZone ?
                                                        <React.Fragment>
                                                            <DropzoneArea
                                                                clearOnUnmount={true}
                                                                filesLimit={100}
                                                                className={this.props.classes.dropzone}
                                                                onChange={this.handleUploadedImage}
                                                            />
                                                            <Button
                                                                color="primary"
                                                                onClick={async () => {
                                                                    const images = [...this.state.temporaryImageSources]
                                                                    await this.setAsyncState({
                                                                        showDropZone: false,
                                                                        imageSources: images,
                                                                        temporaryImageSources: []
                                                                    });
                                                                }}
                                                            >
                                                                OK
                                                            </Button>
                                                            <Button
                                                                color="danger"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        showDropZone: false,
                                                                    });
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </React.Fragment> :
                                                        <Button
                                                            style={{display: this.state.showDropZone ? "none" : "block"}}
                                                            color="primary"
                                                            onClick={() => {
                                                                this.setState({
                                                                    showDropZone: true,
                                                                });
                                                            }}
                                                        >
                                                            Upload images
                                                        </Button>
                                                    }
                                                    {this.state.imageSources &&
                                                    <PhotosGallery
                                                        items={this.state.imageSources}
                                                        onChange={async (imageSources) => await this.setAsyncState({
                                                            imageSources: imageSources})}
                                                    />}
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </React.Fragment>}
                                <div className={this.props.classes.bottomPane} style={{
                                    backgroundColor: this.props.defaultTheme.background.paper
                                }}>
                                    <div>
                                        <MoreMenu icon="arrowHorizontal" direction="right" itemActions={productActions}/>
                                    </div>
                                    <div className={this.props.classes.bottomPaneButtons}>
                                        <Button
                                            disabled={this.state.title.length === 0}
                                            onClick={async () => {
                                                await this.saveProduct();
                                            }}
                                            color="primary"
                                        >
                                            <div>Save</div>
                                        </Button>
                                        <Button onClick={() => this.setState({showDiscardModal: true})} color="danger">
                                            Discard
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal
                            showModal={this.state.showDiscardModal}
                            {...this.state.discardModal}
                        />
                        <Snackbar
                            open={this.state.showSavedMessage}
                            place="tc"
                            color="success"
                            icon={InfoSharp}
                            message="The product was updated successfully"
                        />
                    </MuiThemeProvider>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ViewProductEditor));

ViewProductEditor.propTypes = {
    classes: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    control: PropTypes.object,
    defaultTheme: PropTypes.object
};