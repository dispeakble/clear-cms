import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import Snackbar from "components/Snackbar/Snackbar.js";
import ViewProducts from "../templates/ViewProducts/ViewProducts";
import ViewProductEditor from "../templates/ViewProducts/ViewProductEditor";
import axios from "axios";
import _ from "lodash";

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
        add: (params) => this.add(params),
        list: () => this.list(),
        remove: (params) => this.remove(params),
        listCategories: (params) => this.listCategories(params),
        listLocalities: (params) => this.listLocalities(params)
    };

    help = {
        fileExtension: (string) => {
            const p = string.split('.');
            return p[p.length - 1].toLowerCase();
        }
    }


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
                const paramsClone = _.cloneDeep(params);

                if(paramsClone.imageSources && paramsClone.imageSources.length) {
                    paramsClone.imageSources = paramsClone.imageSources.map((image) => ({
                        ...image,
                        file: "",
                        fileBase64: "",
                        fileItem: []
                    }))
                }

                const response = await this.sendMessage({
                    module: 'system',
                    api: 'products',
                    act: 'add',
                    payload: paramsClone
                });

                if(params.imageSources && params.imageSources.length) {
                    const fileList = []
                    params.imageSources.map((image, index) =>
                        fileList.push({
                            file: image.fileItem,
                            name: response.imageSources[index].image_id + "." + this.help.fileExtension(image.path)}
                        ));
                    await this.uploadImages({
                        path: `/products/${response.id}/`,
                        files: fileList
                    });
                }

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

    listLocalities(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'productLocality',
                    act: 'list',
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

    uploadImages(params) {
        return new Promise(resolve => {
            let formData = new FormData();

            formData.append('path', params.path || "products/");
            formData.append('replace', params.replace || true);
            formData.append('totalFiles', params.files.length);

            //always place the files at the end
            Array.from(params.files).forEach(fileData => {
                formData.append(fileData.name || fileData.file.name, fileData.file, fileData.name || fileData.file.name);
            });
            axios.post("/bucket", formData, {
                onUploadProgress: evt => {
                    if(evt.loaded === evt.total){
                        resolve();
                    }
                    // params.progress(evt)
                }
            });
        });
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