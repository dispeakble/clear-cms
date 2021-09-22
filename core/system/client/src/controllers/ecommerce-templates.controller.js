import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import Snackbar from "components/Snackbar/Snackbar.js";
import ViewEcommerceTemplates from "../templates/ViewEcommerceTemplates/ViewEcommerceTemplates";

class ProductTemplates extends Component {
    state = {
        errorNotification : [],
    };
    services = this.props.services;
    messageCallbacks = {};
    config = {
        prefix: 'ecommerce-templates/'
    };

    control = {
        list: (params) => this.list(params),
        listTemplates: (params) => this.listTemplates(params),
        edit: (params) => this.edit(params)
    };


    async componentDidMount() {

        this.services.ws.subscribe({
            channel: 'ecommerce-templates',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

    }

    list(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'ecommerceTemplates',
                    act: 'list',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    listTemplates(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'ecommerceTemplates',
                    act: 'listTemplates',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    edit(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'ecommerceTemplates',
                    act: 'edit',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in ecommerce templates controller', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'ecommerce-templates',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    updateErrorNotification (errMsg) {
        this.setState({
            errorNotification : [...this.state.errorNotification, errMsg]
        })
    }

    removeErrorNotification (errMsg) {
        const updatedErrorNotification = this.state.errorNotification.filter(msg => msg !== errMsg);
        this.setState({
            errorNotification: updatedErrorNotification,
        })
    }

    render() {
        return (
            <>
                {
                    this.state.errorNotification.map((msg, index) => {
                        return (
                            <Snackbar
                                key={index}
                                place='tc'
                                message={msg}
                                open
                                close
                                closeNotification={() => {this.removeErrorNotification(msg)}}
                                color='warning'
                            />

                        )
                    })
                }
                <ViewEcommerceTemplates control={this.control} {...this.props} />
            </>
        );
    }

}

export default ProductTemplates;

ProductTemplates.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};