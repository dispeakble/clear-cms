import React, { Component } from "react";
import { withStyles} from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/views/productPreview.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import PhotosGalleryPreview from "../../components/PhotosGallery/PhotosGalleryPreview";
import parse from "html-react-parser";
import moment from "moment/moment";
import PropTypes from "prop-types";
import Button from "../../components/CustomButtons/Button";
import {TextField, Typography} from "@material-ui/core";
import countries from 'iso-3166-1-codes'
import Checkbox from "@material-ui/core/Checkbox";
import {Autocomplete} from "@material-ui/lab";

class ProductPreview extends Component {
    state = {
        categories:[],
        localities:[],
        labels: [],
        countryList: [...countries],
        labelData: [],
        currencyList: [{
            id: 1,
            name: "USD"
        },{
            id: 2,
            name: "CAD"
        }],
    };

    async componentDidMount() {
        const product_id = Number(this.props.location.pathObject[2]);

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
        }

        let localityFromStorage = await this.props.control.listLocalities();

        if (localityFromStorage) {
            await this.setAsyncState({localities: localityFromStorage});
        }

        let labelsFromStorage = await this.props.control.listLabels({active: 1});

        if(labelsFromStorage) {
            await this.setAsyncState({labels: labelsFromStorage});
        }

        if(this.props.isLivePreview) {
            await this.setAsyncState({
                ...this.props
            })
        } else {
            await this.fetchAndSet(product_id);
        }
        console.log("Preview", this.props);
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

    getPriceFormat(price) {
        return this.state.currencyList.find(c => c.id === price.currency).name;
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    saveLabelValue = async (id, value) => {
        await this.setAsyncState(prevState => ({
            ...prevState,
            labelData: {
                ...prevState.labelData,
                [id]: value
            }
        }))
    }

    getCountryNameById = (id) => {
        const country = this.state.countryList.find(country => country.numeric === id);
        return country.name;
    }

    generateEditableComponent(label) {
        const type = label.type;
        switch(true) {
            case ["string", "date", "time"].indexOf(type) > -1:
                return (<TextField
                    className={this.props.classes.textfield}
                    defaultValue={label.value}
                    value={this.state.labelData[label.id] && this.state.labelData[label.id].value}
                    type={label.type}
                    onChange={async (e) => {
                        if(e.target) {
                            await this.saveLabelValue(label.id, e.target.value)
                        }
                    }
                    }
                    variant={"outlined"}
                    label={label.title}
                />)
            case type === "numeric":
                return (<TextField
                    className={this.props.classes.textfield}
                    defaultValue={label.value}
                    value={this.state.labelData[label.id] && this.state.labelData[label.id].value}
                    type="number"
                    onChange={async (e) => {
                            if(e.target) {
                                await this.saveLabelValue(label.id, e.target.value)
                            }
                        }
                    }
                    variant={"outlined"}
                    label={label.title}
                />)
            case type === "datetime":
                return (<TextField
                    className={this.props.classes.textfield}
                    defaultValue={label.value}
                    value={this.state.labelData[label.id] && this.state.labelData[label.id].value}
                    type="datetime-local"
                    onChange={async (e) => {
                            if(e.target) {
                                await this.saveLabelValue(label.id, e.target.value)
                            }
                        }
                    }
                    variant={"outlined"}
                    label={label.title}
                />)
            case type === "array":
                let itemList = [];
                try {
                    itemList = JSON.parse(label.value);
                } catch (e) {
                    itemList = []
                }
                return (<Autocomplete
                    disablePortal
                    options={itemList}
                    renderInput={(params) => <TextField {...params} label={label.title} />}
                    variant={"outlined"}
                />)
            case type === "object":
                return (<TextField
                    className={this.props.classes.textfield}
                    defaultValue={label.value}
                    value={this.state.labelData[label.id] && this.state.labelData[label.id].value}
                    type="string"
                    onChange={async (e) => {
                            if(e.target) {
                                await this.saveLabelValue(label.id, e.target.value)
                            }
                        }
                    }
                    variant={"outlined"}
                    label={label.title}
                />)
            case type === "boolean":
                return (
                    <React.Fragment>
                        <Typography>
                            {label.title}
                            <Checkbox defaultValue={parseInt(label.value) === 1} checked={parseInt(this.state.labelData[label.id]) === 1} onChange={async (ev, checked) => {
                                    await this.saveLabelValue(label.id,checked ? 1 : 0)
                                }
                            } />
                        </Typography>
                    </React.Fragment>
                )
            default:
                return (<p>Invalid Data type</p>)
        }
    }

    render() {
        const classes = this.props.classes;
        console.log("state", this.state);
        return (
            <React.Fragment>
                <Helmet>
                    <title>Products</title>
                </Helmet>
                <div className={classes.container}>
                    <div className={classes.firstSection}>
                        <div className={classes.leftColumn}>
                            {(this.state.imageSources && this.state.imageSources.length) ? <PhotosGalleryPreview imageSources={this.state.imageSources} /> : <h2>No Photos Are available</h2>}
                        </div>
                        <div className={classes.rightColumn}>
                            <div className={classes.productDescription}>
                                <span>{this.state.currentCategory && this.state.currentCategory.label ? this.state.currentCategory.label : ""}</span>
                                <h1>{this.state.title}</h1>
                                <div>{this.state.description ? parse(this.state.description) : "No Description"}</div>
                            </div>
                            {/* Product Availability */}
                            <div className={classes.productConfiguration}>
                                <div>
                                    <h3>Availability</h3>
                                    <div>
                                        {this.state.availability && `From: ${moment(this.state.availability[0]).calendar()} To: ${moment(this.state.availability[1]).calendar()}`}
                                    </div>
                                </div>
                                <div>
                                    <h3>Unavailability</h3>
                                    <div>
                                        {this.state.unavailability && `From: ${moment(this.state.unavailability[0]).calendar()} To: ${moment(this.state.unavailability[1]).calendar()}`}
                                    </div>
                                </div>
                                <div className={classes.productPrice}>
                                    {this.state.priceList && this.state.priceList.length && this.state.priceList.filter(price => price.value).map((price, index) => {
                                        return <span key={index}>{price.value + " " + this.getPriceFormat(price)}</span>
                                    })}
                                </div>
                                <Button
                                    color="primary"
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={classes.secondSection}>
                        <div className={classes.productConfiguration}>
                            <h3>Labels</h3>
                            {
                                this.state.labels && this.state.labels.length &&
                                this.state.labels.map((label, index) => <div key={index}>{this.generateEditableComponent(label)}</div>)
                            }
                        </div>
                        <div>
                            <h3>Locality</h3>
                            {this.state.currentLocality && <div>
                                <div>
                                    <h5>City</h5>
                                    <div>{this.state.currentLocality.title}</div>
                                </div>
                                <div>
                                    <h5>Country</h5>
                                    <div>{this.getCountryNameById(this.state.currentLocality.country_id)}</div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ProductPreview));

ProductPreview.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object,
    isLivePreview: PropTypes.bool
}