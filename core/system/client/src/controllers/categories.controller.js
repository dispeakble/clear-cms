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
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
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
                    payload: {}
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
                if(params.backgroundimage){
                    fileName = `background.${this.help.fileExtension(params.backgroundimage.name)}`
                }
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'add',
                    payload: {
                        title: params.title,
                        description: params.description,
                        backgroundimage: fileName,
                        parentid: params.parentid,
                    }
                });

                if(params.backgroundimage){
                    await this.uploadImages({
                        path: "/categories/category-" + response.categoryId + "/",
                        files: [{name: fileName, file: params.backgroundimage}]
                    })
                }

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
                    api: 'categories',
                    act: 'remove',
                    payload: {
                        id: params.id
                    }
                });

                if(params.backgroundimage){
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

    edit(params){
        return new Promise(async resolve => {
            try {
                let fileName = params.backgroundimage
                if(params.backgroundimage && params.backgroundimage.name){
                    fileName = `background.${this.help.fileExtension(params.backgroundimage.name)}`
                }
                console.log({...params})
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'edit',
                    payload: {
                        id: params.id,
                        title: params.title,
                        description: params.description,
                        backgroundimage: params.removeBg ? "" : fileName,
                        parentid: params.parentid
                    }
                });
                if(params.backgroundimage.name || (!params.backgroundimage) || params.removeBg){
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
                if(params.backgroundimage.name){
                    await this.uploadImages({
                        path: "/categories/category-" + params.id + "/",
                        files: [{name: fileName, file: params.backgroundimage}]
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