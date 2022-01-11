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
        duplicate: (params) => this.duplicate(params),
        rem: (params) => this.rem(params),
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
                    payload: null
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    list(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
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

    get(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'get',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    getPublicTheme() {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'publicThemes',
                    act: 'getOne',
                    payload: {
                        isDefault: 1
                    }
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

                if (params.pageConfig.backgroundImageFile) {
                    params.pageConfig.backgroundImage = `background.${this.help.fileExtension(params.pageConfig.backgroundImageFile.name)}`;
                }

                const dbPayload = _.cloneDeep(params);


                dbPayload.items = dbPayload.items.map((item) => {
                    if (item.backgroundImageFile) {
                        item.backgroundImage = `background.${this.help.fileExtension(item.backgroundImageFile.name)}`;
                    }

                    //for the DB we don't need to send binaries
                    delete item.backgroundImageFile;

                    if(Array.isArray(item.moduleOptions.files)) {
                        item.moduleOptions.files = item.moduleOptions.files.map(itemFile => {
                            delete itemFile.file;
                            return itemFile;
                        });
                    }

                    const itemKeys = Object.keys(item).filter(key => !(['title', 'module', 'moduleOptions'].includes(key)));

                    const moduleData = {};

                    itemKeys.map(key => {
                        moduleData[key] = item[key]
                        return key;
                    });

                    return {
                        title: item.title,
                        module: item.module,
                        x: item.x,
                        y: item.y,
                        i: item.i,
                        moduleOptions: item.moduleOptions,
                        data: moduleData
                    };
                });

                //we will add new boxes to get the page id and box ids
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'add',
                    payload: dbPayload
                });

                //Uploading page background
                if (params.pageConfig.backgroundImageFile) {
                    await this.uploadFiles({
                        path: "/pages/page-" + response.pageId + "/",
                        files: [{
                            name: params.pageConfig.backgroundImage,
                            file: params.pageConfig.backgroundImageFile
                        }]
                    })
                }

                await Promise.all(params.items.filter(item => !item.templateUsed).map((item, i) => {
                    return new Promise((resolve_upload) => {

                        //Uploading box background
                        if (item.backgroundImageFile) {
                            this.uploadFiles({
                                path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/",
                                files: [{
                                    name: `background.${this.help.fileExtension(item.backgroundImageFile.name)}`,
                                    file: item.backgroundImageFile
                                }]
                            });
                        }

                        //Uploading box files
                        if (item.module && Array.isArray(item.files) && item.files.length) {

                            const newFiles = item.files.filter(fileObj => !!fileObj.file);

                            this.uploadFiles({
                                path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/module/",
                                files: newFiles
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

    rem(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'rem',
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
                if (params.pageConfig.backgroundImageFile) {
                    params.pageConfig.backgroundImage = `background.${this.help.fileExtension(params.pageConfig.backgroundImageFile.name)}`;
                    if (params.pageConfig.backgroundImageFile) {
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

                        await this.uploadFiles({
                            path: "/pages/page-" + params.id + "/",
                            files: [{
                                name: params.pageConfig.backgroundImage,
                                file: params.pageConfig.backgroundImageFile
                            }]
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
                    if (item.backgroundImageFile) {
                        item.backgroundImage = `background.${this.help.fileExtension(item.backgroundImageFile.name)}`;
                    }
                    item.backgroundImageFile = "";//for the DB we don't need to send binaries
                    if (item.moduleOptions && item.moduleOptions && item.moduleOptions.files) {
                        item.moduleOptions.files = item.moduleOptions.files.map(itemFile => {
                            delete itemFile.file;
                            return itemFile;
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
                        if (Number(item.i) === Number(dbItem.ref)) {
                            item.id = dbItem.id;
                        }
                        return dbItem
                    });
                    return item;
                });

                await Promise.all(params.items.map(async (item, i) => {
                    if (item.backgroundImageFile) {
                        item.backgroundImage = item.backgroundImageFile.name;
                        await this.uploadFiles({
                            path: "/pages/page-" + params.id + "/box-" + item.id,
                            files: [{
                                name: `background.${this.help.fileExtension(item.backgroundImageFile.name)}`,
                                file: item.backgroundImageFile
                            }]
                        })
                    } else if (item.backgroundImage.indexOf('__delete__') === 0) {
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

                    if (item.moduleOptions?.files && item.moduleOptions?.files.length) {
                        const fileList = [];
                        item.moduleOptions.files.forEach((fileData) => {
                            if(fileData.file) {
                                fileList.push({file: fileData.file, name: fileData.name})
                            }
                        });

                        await this.uploadFiles({
                            path: "/pages/page-" + params.id + "/box-" + item.id + "/module",
                            files: fileList
                        });

                        item.moduleOptions.files.map((fileData) => {
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

    duplicate(params) {
        return new Promise((resolve) => {
            (async () => {
                const duplicateResponse = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'duplicate',
                    payload: {
                        id: params.id
                    }
                });
                console.log(duplicateResponse);
                resolve(true);
            })();
        });
    }

    uploadFiles(params) {
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
                    if (evt.loaded === evt.total) {
                        resolve();
                    }
                    // params.progress(evt)
                }
            });
        });
    }

    addCategory(params) {
        return this.sendMessage({
            module: 'system',
            api: 'categories',
            act: 'add',
            payload: {
                title: params.title,
                description: params.description
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