import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewPages from "../templates/ViewPages/ViewPages";
import ViewPagesEditor from "../templates/ViewPages/ViewPagesEditor";
import ViewPagesPreview from "../templates/ViewPages/ViewPagesPreview";
import axios from "axios";
import _ from "lodash";

class PagesController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        get: (params) => this.get(params),
        add: (params) => this.add(params),
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
        listCategories: (params) => this.listCategories(params),
    };

    help = {
        fileExtension: (string) => {
            const p = string.split('.');
            return p[p.length - 1].toLowerCase();
        }
    }

    channel = 'pages';

    async componentDidMount() {
        console.log(this.props);
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

    listCategories(){
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

    list(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'list',
                    payload: {}
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    get(params){
        return new Promise(async resolve => {
            try {
                /*const downloadParams = {
                    module: 'system',
                    api: 'bucket',
                    act: 'download',
                }*/
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'get',
                    payload: params
                });
                const editPage = _.cloneDeep(response)
                /*const file = await this.sendMessage({
                    ...downloadParams,
                    payload: {
                        src: response.pageConfig.backgroundImage,
                        source_path: '/pages/page-'+response.id+'/'
                    }
                });
                response.pageConfig.backgroundImage = file && "data:"+file.mimeType+";base64," +file.file*/
                /*await Promise.all(response.items.map(async (item, i) => {
                    if(item.backgroundImage){
                        const file = await this.sendMessage({
                            ...downloadParams,
                            payload: {
                                src: item.backgroundImage,
                                source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                            }
                        });
                        response.items[i].backgroundImage = file &&  "data:"+file.mimeType+";base64," +file.file
                    }

                    if(item.module === "Header Module"  ){
                        if(item.moduleOptions.data.bg){
                            const file = await this.sendMessage({
                                ...downloadParams,
                                payload: {
                                    src: item.moduleOptions.data.bg,
                                    source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                                }
                            });
                            editPage.items[i] = {...editPage.items[i], module: item.module, modulePath1: '/pages/page-'+response.id+'/box-'+item.i+'/'+item.moduleOptions.data.bg}
                            response.items[i].moduleOptions.data.bg = file && "data:"+file.mimeType+";base64," +file.file
                        }
                        if(item.moduleOptions.data.logoImage){
                            const file = await this.sendMessage({
                                ...downloadParams,
                                payload: {
                                    src: item.moduleOptions.data.logoImage,
                                    source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                                }
                            });
                            editPage.items[i] = {...editPage.items[i], module: item.module, modulePath2: '/pages/page-'+response.id+'/box-'+item.i+'/'+item.moduleOptions.data.logoImage}
                            response.items[i].moduleOptions.data.logoImage = file && "data:"+file.mimeType+";base64," +file.file
                        }
                    } else if(item.module === "Banner Module" && item.moduleOptions.data?.backgroundImageFile) {
                        const file = await this.sendMessage({
                           ...downloadParams,
                            payload: {
                                src: item.moduleOptions.data.backgroundImage,
                                source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                            }
                        });
                        response.items[i].moduleOptions.data.backgroundImage = file && "data:"+file.mimeType+";base64," +file.file
                    }
                }))*/
                response.editPage = editPage
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    add(params){
        return new Promise(async resolve => {
            try {

                if(params.pageConfig.backgroundImageFile) {
                    params.pageConfig.backgroundImage = `background.${this.help.fileExtension(params.pageConfig.backgroundImageFile.name)}`;
                }

                const paramsClone = _.cloneDeep(params);

                paramsClone.items = paramsClone.items.map((item) => {
                    if(item.moduleOptions && item.moduleOptions.data && item.moduleOptions.data.files){
                        item.moduleOptions.data.files = item.moduleOptions.data.files.map(itemFile => {
                            return {name: itemFile.name, sel: itemFile.sel}
                        });
                    }
                    if(item.backgroundImage && item.backgroundImage.length){
                        item.backgroundImage = `background.${this.help.fileExtension(item.backgroundImageFile.name)}`;
                        delete item.backgroundImageFile;
                    }
                    return item;
                });

                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'add',
                    payload: paramsClone
                });
                console.log(response)
                // uploading images (response should have page + boxes ID)
                if(params.pageConfig.backgroundImageFile){
                    await this.uploadImages({
                        path: "/pages/page-" + response.pageId + "/",
                        files: [{name: params.pageConfig.backgroundImage, file: params.pageConfig.backgroundImageFile}]
                    })
                }

                await Promise.all(params.items.map((item, i) => {
                    return new Promise(async (resolve_upload) => {
                        if(item.backgroundImageFile){
                            await this.uploadImages({
                                path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/",
                                files: [{name: `background.${this.help.fileExtension(item.backgroundImageFile.name)}`, file: item.backgroundImageFile}]
                            });
                        }

                        if(item.module && item.moduleOptions.data.files && item.moduleOptions.data.files.length){
                            const fileList = [];
                            item.moduleOptions.data.files.forEach((fileData) => {
                                fileList.push({file: fileData.file, name: fileData.name})
                            });

                            await this.uploadImages({
                                path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/module/",
                                files: fileList
                            });

                            params.items[i].moduleOptions.data.files = item.moduleOptions.data.files.map((fileData) => {
                                return {
                                    name: fileData.name
                                }
                            });
                        }

                        resolve_upload(true);
                    });

                }))
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
                    api: 'pages',
                    act: 'remove',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    edit(params){
        return new Promise(async resolve => {
            try {
                if(params.pageConfig.backgroundImageFile) {
                    params.pageConfig.backgroundImage = `background.${this.help.fileExtension(params.pageConfig.backgroundImageFile.name)}`;
                    if(params.pageConfig.backgroundImageFile){
                        if (params.pageConfig.oldBackgroundImage) {
                            await this.sendMessage({
                                module: 'system',
                                api: 'bucket',
                                act: 'rm',
                                payload: {
                                    path: `/pages/page-${params.id}`,
                                    selection: [params.pageConfig.oldBackgroundImage]
                                }
                            });
                        }

                        await this.uploadImages({
                            path: "/pages/page-" + params.id + "/",
                            files: [{name: params.pageConfig.backgroundImage, file: params.pageConfig.backgroundImageFile}]
                        });

                    }
                } else if (params.pageConfig.oldBackgroundImage && !params.pageConfig.backgroundImage.length) {
                    this.sendMessage({
                        module: 'system',
                        api: 'bucket',
                        act: 'rm',
                        payload: {
                            path: `/pages/page-${params.id}`,
                            selection: [params.pageConfig.oldBackgroundImage]
                        }
                    });
                }

                const paramsClone = _.cloneDeep(params);

                //we will add new boxes to get the IDs

                paramsClone.items = paramsClone.items.map((item) => {
                    if(item.backgroundImageFile){
                        item.backgroundImage = `background.${this.help.fileExtension(item.backgroundImageFile.name)}`;
                    }
                    item.backgroundImageFile = "";//for the DB we don't need to send binaries
                    if(item.moduleOptions && item.moduleOptions.data && item.moduleOptions.data.files){
                        item.moduleOptions.data.files = item.moduleOptions.data.files.map(itemFile => {
                            return {
                                name: itemFile.name,
                                sel: itemFile.sel
                            }
                        });
                    }
                    return item;
                });

                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'edit',
                    payload: paramsClone
                });

                params.items = params.items.map((item) => {

                    response.items.map((dbItem) => {
                        if(Number(item.i) === Number(dbItem.ref)){
                            item.id = dbItem.id;
                        }
                    });

                    return item;
                });

                await Promise.all(params.items.map(async (item, i) => {
                    if (item.backgroundImageFile) {
                        item.backgroundImage =  item.backgroundImageFile.name;
                        await this.uploadImages({
                            path: "/pages/page-" + params.id + "/box-" + item.id,
                            files: [{name: `background.${this.help.fileExtension(item.backgroundImageFile.name)}`, file: item.backgroundImageFile}]
                        })
                    } else if(item.backgroundImage.indexOf('__delete__') === 0){
                        await this.sendMessage({
                            module: 'system',
                            api: 'bucket',
                            act: 'rm',
                            payload: {
                                path: `/pages/page-${params.id}/box-${item.id}/`,
                                selection: [item.backgroundImage.replace('__delete__', '')]
                            }
                        });
                    }

                    if(item.moduleOptions.data?.files && item.moduleOptions.data?.files.length){
                        const fileList = [];
                        item.moduleOptions.data.files.forEach((fileData) => {
                            fileList.push({file: fileData.file, name: fileData.name})
                        });

                        await this.uploadImages({
                            path: "/pages/page-" + params.id + "/box-" + item.id + "/module",
                            files: fileList
                        });

                        item.moduleOptions.data.files.map((fileData) => {
                            return {
                                name: fileData.name
                            }
                        });
                    }

                }))
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    uploadImages(params) {
        return new Promise(resolve => {
            var formData = new FormData();

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
        switch (this.props.location.pathObject[1]) {
            default:
                return <ViewPages control={this.control} {...this.props} />;
                break;
            case 'edit':
                return <ViewPagesEditor control={this.control} {...this.props} />;
                break;
            case 'add':
                return <ViewPagesEditor control={this.control} {...this.props} />;
                break;
            case 'preview':
                return <ViewPagesPreview control={this.control} {...this.props} />;
                break;
        }

    }

}

export default PagesController;

PagesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};