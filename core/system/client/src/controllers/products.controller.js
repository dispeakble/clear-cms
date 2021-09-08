import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import Snackbar from "components/Snackbar/Snackbar.js";
import ViewProducts from "../templates/ViewProducts/ViewProducts";
import ViewProductEditor from "../templates/ViewProducts/ViewProductEditor";

class ProductsController extends Component {
    state = {
        errorNotification : [],
    };
    services = this.props.services;
    messageCallbacks = {};
    config = {
        prefix: 'products/'
    };
    control = {
        get: (params) => this.getData(params),
        edit: (params) => this.editData(params),
        listCategories: (params) => this.listCategories(params),
        add: (params) => this.add(params),
        list: () => this.list(),
        remove: (params) => this.remove(params)
    };


    async componentDidMount() {

        this.services.ws.subscribe({
            channel: 'products',
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
                    api: 'products',
                    act: 'list',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    getData(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'products',
                    act: 'get',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    add(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'products',
                    act: 'add',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    editData(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'products',
                    act: 'edit',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    remove(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'products',
                    act: 'remove',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    listCategories(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'list',
                    payload: {
                        where: params?.where
                    }
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
        console.log('got message in products controller', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'products',
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

    renderPages() {
        switch (this.props.location.pathObject[1]) {
            default:
                return <ViewProducts control={this.control} {...this.props} />;
            case 'edit':
                return <ViewProductEditor control={this.control} {...this.props} />;
            case 'add':
                return <ViewProductEditor control={this.control} {...this.props} />;
        }
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
                {this.renderPages()}
            </>
        );
    }

}

export default ProductsController;

ProductsController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};