import React, { Component } from "react";
import { withStyles} from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/views/productPreview.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import PhotosGalleryPreview from "../../components/PhotosGallery/PhotosGalleryPreview";
import parse from "html-react-parser";
import moment from "moment/moment";
import PropTypes from "prop-types";

class ProductPreview extends Component {
    state = {
        categories:[],
        localities:[]
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
            localityFromStorage = localityFromStorage.map((locality) => ({
                id: locality.id,
                title: locality.title
            }));

            await this.setAsyncState({localities: localityFromStorage});
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
            unavailability: productDetails.unavailability ? productDetails.unavailability : ["", ""]
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

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Products</title>
                </Helmet>
                <div className={classes.container}>
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
                                <span>148$</span>
                                <a href="#" className="cart-btn">Add to cart</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={classes.productConfiguration}>
                        <span>Labels</span>
                        <div>
                            Available: 27th Sept 2021 to 30th November 2021
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