import React, {Component} from "react";
import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {Checkbox, TextField} from "@material-ui/core";
import {CheckBox, CheckBoxOutlineBlank} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

class ProductModule extends Component {
    state = {
        itemModuleEditId: "",
        showModuleOptionsModal: false,
        modalTitle: "Product Details content",
        productProperty: [],
        productPropertyList: [{
            label: "Title",
            value: "title"
        }, {
            label: "Description",
            value: "description"
        }, {
            label: "Category",
            value: "category"
        }, {
            label: "Locality",
            value: "locality"
        }, {
            label: "Labels",
            value: "labels"
        }, {
            label: "Availability",
            value: "availability"
        }, {
            label: "Unavailability",
            value: "unavailability"
        }, {
            label: "Prices",
            value: "prices"
        }, {
            label: "Gallery",
            value: "gallery"
        }]
    };

    componentDidMount() {
        console.log('props', this.props.moduleOptions);
    }

    getTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiDialogTitle: {
                    root: {
                        padding: "16px 24px 0",
                    },
                },
            },
        });
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

    getIndex = (productList, label) => {
        let index;
        index = [...productList].findIndex((property) => {
            return property.value === label.value
        });
        return index;
    }


    render() {
        return (
            <div>
                <div>
                    <Typography gutterBottom>
                        Which part of the product to display:
                    </Typography>
                </div>
                <div>
                    <Autocomplete
                        onChange={async (event, label) => {
                            let newProductList = [...this.state.productProperty];
                            let index = this.getIndex(this.state.productProperty, label)
                            if(index >= 0) {
                                newProductList.splice(index, 1)
                            }else {
                                newProductList.push(label)
                            }
                            await this.setAsyncState({
                                productProperty: newProductList
                            });
                            this.props.onUpdate(this.state);
                        }}
                        disableCloseOnSelect
                        className={this.props.classes.option}
                        value={this.state.productProperty.length ? this.state.productProperty : []}
                        options={this.state.productPropertyList}
                        autoHighlight
                        getOptionLabel={(option) => option.label || ""}
                        renderOption={(props) => {
                            const index = this.getIndex(this.state.productProperty, props);
                            return (
                                <span {...props}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlank fontSize={"small"}/>}
                                        checkedIcon={<CheckBox fontSize={"small"}/>}
                                        style={{marginRight: 8}}
                                        checked={index >= 0}
                                    />
                                    {props.label}
                                </span>
                            )
                        }}
                        renderInput={(params) => (
                            <TextField
                                className={this.props.classes.textfield}
                                label="Product property"
                                {...params}
                                variant="outlined"
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ProductModule);

ProductModule.propTypes = {
    classes: PropTypes.object,
    defaultTheme: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};