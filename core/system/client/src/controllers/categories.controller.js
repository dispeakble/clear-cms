import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewCategories from "../templates/ViewCategories/ViewCategories";
import axios from "axios";

class CategoriesController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        add: (params) => this.add(params),
        set: (params) => this.set(params),
        rem: (params) => this.rem(params),
    };
    channel = 'categories';

    help = {
        fileExtension: (string) => {
            const p = string.split('.');
            return p[p.length - 1].toLowerCase();
        }
    }

    async componentDidMount() {
        this.props.services.ws.subscribe({
            channel: this.channel,
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in categories controller', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.props.services.ws.emit({
                id: uniqueId,
                channel: this.channel,
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    list(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'list',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    add(params){
        return new Promise(async resolve => {
            try {
                let fileName = ""
                if(params.backgroundImage){
                    fileName = `background.${this.help.fileExtension(params.backgroundImage.name)}`
                }
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'add',
                    payload: {
                        title: params.title,
                        description: params.description,
                        backgroundImage: fileName,
                        parentId: params.parentId,
                    }
                });

                if(params.backgroundImage){
                    await this.uploadImages({
                        path: "/categories/category-" + response.categoryId + "/",
                        files: [{name: fileName, file: params.backgroundImage}]
                    })
                }

                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    rem(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'rem',
                    payload: {
                        id: params.id
                    }
                });

                if(params.backgroundImage){
                    await this.sendMessage({
                        module: 'system',
                        api: 'bucket',
                        act: 'rm',
                        payload: {
                            path: `/categories/`,
                            selection: [`category-${params.id}`]
                        }
                    });
                }

                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    set(params){
        return new Promise(async resolve => {
            try {
                let fileName = params.backgroundImage
                if(params.backgroundImage && params.backgroundImage.name){
                    fileName = `background.${this.help.fileExtension(params.backgroundImage.name)}`
                }
                console.log({...params})
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'set',
                    payload: {
                        id: params.id,
                        title: params.title,
                        description: params.description,
                        backgroundImage: params.removeBg ? "" : fileName,
                        parentId: params.parentId
                    }
                });
                if(params.backgroundImage.name || (!params.backgroundImage) || params.removeBg){
                    await this.sendMessage({
                        module: 'system',
                        api: 'bucket',
                        act: 'rm',
                        payload: {
                            path: `/categories/`,
                            selection: [`category-${params.id}`]
                        }
                    });
                }
                if(params.backgroundImage.name){
                    await this.uploadImages({
                        path: "/categories/category-" + params.id + "/",
                        files: [{name: fileName, file: params.backgroundImage}]
                    })
                }


                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    uploadImages(params) {
        return new Promise(resolve => {
            let formData = new FormData();

            formData.append('path', params.path || "pages/page/");
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

    render() {
        return <ViewCategories control={this.control} {...this.props} />;
    }

}

export default CategoriesController;

CategoriesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};