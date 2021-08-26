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
        addCategory: (params) => this.addCategory(params),
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
        listCategories: (params) => this.listCategories(params),
        listTemplates: (params) => this.listTemplates(params),
        getPublicTheme: () => this.getPublicTheme(),
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

    listTemplates(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'list',
                    payload: {isTemplate: true}
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
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'get',
                    payload: params
                });
                const editPage = _.cloneDeep(response);
                response.editPage = editPage
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    getPublicTheme(){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'publicThemes',
                    act: 'getOne',
                    payload: {
                        isdefault: 1
                    }
                });
                const editPage = _.cloneDeep(response);
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
                    if(item.moduleOptions.data?.imageSources){
                        item.moduleOptions.data.imageSources = item.moduleOptions.data.imageSources.map(el => {
                            return {
                                ...el, file: el.path, fileItem: "", fileBase64: ""
                            }
                        })
                    }
                    return item;
                });

                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'add',
                    payload: paramsClone
                });

                // uploading images (response should have page + boxes ID)
                if(params.pageConfig.backgroundImageFile){
                    await this.uploadImages({
                        path: "/pages/page-" + response.pageId + "/",
                        files: [{name: params.pageConfig.backgroundImage, file: params.pageConfig.backgroundImageFile}]
                    })
                }

                await Promise.all(params.items.filter(item => !item.templateUsed).map((item, i) => {
                    return new Promise(async (resolve_upload) => {
                        if(item.backgroundImageFile){
                            await this.uploadImages({
                                path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/",
                                files: [{name: `background.${this.help.fileExtension(item.backgroundImageFile.name)}`, file: item.backgroundImageFile}]
                            });
                        }

                        if(item.module && item.moduleOptions.data?.files && item.moduleOptions.data?.files.length){
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
                    if(item.moduleOptions.data?.imageSources){
                        item.moduleOptions.data.imageSources = item.moduleOptions.data.imageSources.map(el => {
                            return {
                            ...el, file: el.path, fileItem: "", fileBase64: ""
                            }
                        })
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
                        return dbItem
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

    addCategory(params) {
         return  this.sendMessage({
            module: 'system',
            api: 'categories',
            act: 'add',
            payload: {
                title: params.title,
                description:params.description
            }
        });
    }

    render() {
        switch (this.props.location.pathObject[1]) {
            default:
                return <ViewPages control={this.control} {...this.props} />;
            case 'edit':
                return <ViewPagesEditor control={this.control} {...this.props} />;
            case 'add':
                return <ViewPagesEditor control={this.control} {...this.props} />;
            case 'preview':
                return <ViewPagesPreview control={this.control} {...this.props} />;
        }

    }

}

export default PagesController;

PagesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};