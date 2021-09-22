import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/productTemplates.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import Button from "../../components/CustomButtons/Button";

class ProductTemplates extends Component {
    state = {
        templates: [],
        ecommerceTemplates:[]
    };

    async componentDidMount() {
        const templates = await this.props.control.listTemplates();
        await this.setAsyncState({templates: templates});

        const ecommerceTemplates = await this.props.control.list();
        await this.setAsyncState({
            ecommerceTemplates: ecommerceTemplates
        })
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async handleTemplateChange(index, value) {
        const ecommerceTemplates = [...this.state.ecommerceTemplates];
        ecommerceTemplates[index].template_id = value ? value.id : 0

        await this.setAsyncState({
            ecommerceTemplates: ecommerceTemplates
        })
    }

    async updateEcommerceTemplates() {
        await this.props.control.edit({ecommerceTemplates: this.state.ecommerceTemplates});
    }


    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Product Templates</title>
                </Helmet>
                <div className={classes.panel}>
                    <div className={this.props.classes.ecommerceTemplatesDropdowns}>
                        {this.state.ecommerceTemplates.length && this.state.ecommerceTemplates.map((entity, index) => {
                            return <div key={index}>
                                <Autocomplete
                                    onChange={(e, value) => this.handleTemplateChange(index, value)}
                                    className={this.props.classes.option}
                                    options={this.state.templates}
                                    sx={{ width: 300 }}
                                    value={entity.template_id ? this.state.templates.find(template => template.id === entity.template_id) : []}
                                    autoHighlight
                                    getOptionLabel={(option) => option.title}
                                    // value={this.state.template}
                                    renderInput={(params) => (
                                        <TextField
                                            className={this.props.classes.textfield}
                                            {...params}
                                            label={`Select ${entity.title}`}
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>
                        })}
                    </div>
                    <div className={this.props.classes.actions}>
                        <Button
                            onClick={async () => {
                                await this.updateEcommerceTemplates();
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
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ProductTemplates));
