import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import {promises as fsp} from "fs";
import * as mime from "mime";
import { Observable, Subscriber } from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";
import {HelpService} from "./help.service";
import { ProtocolService } from "./protocol.service";
import { Readable } from "stream";

@Injectable()
export class BucketService {

    private methods = ["checkAccess", "getMeta", "info", "get", "chmod", "chown", "list", "completePath", "upload", "uploadFromBase64", "read", "rename", "move", "download", "copy", "rm", "mkdir", "recycle", "archive", "extract"];
    private publicPaths = ["view-auth", "recover-password", "static", "manifest.json"];//TODO GET THIS FROM A CONFIG
    private defaultPath = 'index.html';
    private help: any;


    constructor(private protocolService: ProtocolService, private helpService: HelpService) {
        this.help = helpService.help;
    }

    private info(params: any, options: any) {
        return new Promise((resolve) => {
            try {
                const metaPayload: payloadInterface = {
                    channel: `bucket`,
                    api: 'fs',
                    act: 'info',
                    payload: {
                        path: path.join('/system/public/', params.path)
                    }
                };

                const resolve_info = (data, file_name) => {
                    const etagId = etag.default(Buffer.from(JSON.stringify(data)));
                    resolve({modified: data.mtimeMs, size: data.size, "etagId": etagId, file_name: file_name});
                }

                this.protocolService.sendMessage(metaPayload).subscribe((data) => {
                    if(data.content_type === '404' && options.defaultFileName){
                        metaPayload.payload.path = `/system/public/${options.defaultFileName}`;
                        this.protocolService.sendMessage(metaPayload).subscribe((data) => {
                            resolve_info(data, options.defaultFileName);
                        });
                    } else {
                        resolve_info(data, params.path);
                    }
                }, (err) => {
                    resolve(err);
                }, () => {

                });

            } catch (err) {
                console.log(err.message);
                resolve(err.message);
            }

        });
    }

    private upload(params: any, config){
        return new Observable(subscriber => {

            const handShake = this.protocolService.startHandshake({
                channel: 'bucket',
                indication: {
                    api: 'fs',
                    act: 'upload'
                }
            }, {channel: 'system'});

            handShake.theObserver.subscribe((data) => {
                console.log(data);
            }, (err) => {
                console.log(err.message);
            })

            handShake.thePromise.then((handshakeResponse: {thePusher: Subscriber<any>}) => {
                params.initiator.subscribe(data => {
                    handshakeResponse.thePusher.next(data)
                }, err => {
                    console.log(err.message);
                    handshakeResponse.thePusher.error(err.message);
                    subscriber.error(err.message);
                }, () => {
                    handshakeResponse.thePusher.complete();
                    subscriber.complete();
                });

                subscriber.next('.');
            });

        });
    }

    private uploadFromBase64(params) {

        const initiator = new Observable(subscriber => {
            let buff = Buffer.from(params.base64, 'base64');
            subscriber.next({
                payload: {
                    type: "meta",
                    length: buff.length,
                    filename: params.filename,
                    path: "themes",
                    replace: true
                }
            });

            const stream = Readable.from(buff);

            let index = 0;
            const t = Math.random();

            stream.on('data', (chunk: any) => {
                index++;
                subscriber.next({
                    payload: {
                        type: "data",
                        index: `${t}-${index}`,
                        buffer: chunk
                    }
                });
            });

            stream.on('end', () => {
                subscriber.complete();
            });

            stream.on('error', () => {
                subscriber.error(`upload failed for: ${params.filename}`);
            })
        });

        return this.perform({
            act: 'upload',
            payload: {
                initiator: initiator
            }
        }).toPromise();
    }

    private checkPaths(data: any){
        const params = data.path;
        let file_name = '';

        if (data.path && data.path.length) {
            file_name = `${params.replace('/', '')}`;
        } else {
            return true;
        }
        let hasAccess = false;
        this.publicPaths.forEach((e) => {
            if(file_name.indexOf(e) === 0){
                hasAccess = true;
            }
        });
        return hasAccess;
    }

    public checkAccess(data: any) {
        return new Observable(subscriber => {
            if(!this.checkPaths(data)){
                subscriber.error({
                    access: false,
                    status: HttpStatus.TEMPORARY_REDIRECT,
                    location: this.publicPaths[0]
                });
            }

            subscriber.next({
                access: true
            });

            subscriber.complete();
        });
    }

    private _getBucketMeta(params) {
        return new Promise((resolve) => {
            const path_parts = params.path.split('/');
            this.protocolService.sendMessage({
                channel: `bucket`,
                api: 'fs',
                act: 'info',
                payload: {
                    path: '/' + path_parts.slice(1).join('/')
                }
            }).subscribe(response => {
                try {
                    resolve({
                        type: 'object',
                        data: {
                            modified: response.data.mtime,
                            size: response.data.size,
                            "etagId": response.data.etagId,
                            file_name: params.path
                        }
                    });
                } catch (err) {
                    resolve({
                        type: 'error',
                        message: {
                            type: '404 not found',
                            path: params.path
                        }
                    })
                }

            }, err => {
                resolve(err);
            }, () => {

            })
        });
    }

    public getMeta(data: any) {
        if(this._isBucket({path: data.path})) {
            return this._getBucketMeta({
                path: data.path
            });
        }
        return new Promise(async (resolve) => {

            const params = data.path;

            const response = {
                type: "object",
                content_type: "object",
                data: {
                    modified: "",
                    size: "",
                    etagId: "",
                    file_name: ""
                }
            };

            let file_name = '';

            if (data.path && data.path.length) {
                file_name = params;
            } else {
                file_name = this.defaultPath;
            }

            const file_path = path.join(__dirname, '..', '..', 'public');
            let stats = null;

            try {
                stats = await fsp.stat(path.join(file_path, file_name));
                if(stats.isDirectory()) {
                    file_name = this.defaultPath;
                    stats = await fsp.stat(path.join(file_path, file_name));
                }
            } catch (err) {
                try {
                    file_name = this.defaultPath;
                    stats = await fsp.stat(path.join(file_path, file_name));
                } catch (err) {
                    console.warn(err.message);
                }

            }

            if(stats) {
                const etagId = etag.default(stats);
                response.data = {
                    modified: stats.mtimeMs,
                    size: stats.size,
                    etagId,
                    file_name: file_name
                };
            }

            resolve(response);
        });
    }

    private _getFromBucket(params: any) {
        const path_parts = params.path.split('/');
        this.protocolService.sendMessage({
            channel: `bucket`,
            api: 'fs',
            act: 'read',
            payload: {
                path: '/' + path_parts.slice(1).join('/')
            }
        }).subscribe(data => {
            params.observer.next(data);
        }, err => {
            params.observer.error(err);
        }, () => {
            params.observer.complete();
        })
    }

    private _isBucket(params) {
        const path_parts = params.path.split('/');
        return (path_parts[0] === 'files')
    }


    public get(data: any) {
        return new Observable((observer) => {
            let complete_path = this.defaultPath;

            if (data.path && data.path.length && data.path.indexOf('.') > -1) {
                complete_path = data.path;
                if(this._isBucket({path: complete_path})){
                    this._getFromBucket({
                        path: complete_path,
                        observer
                    });
                    return;
                }
            }

            (async () => {
                let stats = null;
                let file_path = path.join(__dirname, '..', '..', 'public', complete_path);
                try {
                    stats = await fsp.stat(file_path)
                } catch (err) {
                    complete_path = this.defaultPath;
                    file_path = path.join(__dirname, '..', '..', 'public', complete_path);
                }

                try {

                    if(!stats) {
                        stats = await fsp.stat(file_path);
                    }

                    observer.next({type: 'meta', content_length: stats.size, content_type: mime.getType(complete_path)});

                    const readStream = fs.createReadStream(file_path, { highWaterMark: 32 * 1024 });

                    readStream.on('data', (chunk) => {
                        observer.next(chunk);
                    }).on('end', () => {
                        observer.complete();
                    }).on('error', (err) => {
                        observer.error(err);
                    });

                } catch (err) {
                    observer.error();
                    observer.complete();
                }

            })()
        });
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'list',
                payload: {
                    path: params.path
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public completePath (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'completePath',
                payload: {
                    path: params.path
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }
    public rm (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'rm',
                payload: params
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public rename (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'rename',
                payload: {
                    source_path: path.join(params.path, params.source),
                    dest_path: path.join(params.path, params.dest),
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public move (params: any){
        return new Observable(subscriber => {
            //check if the file already exists in the selected folder
            //if it already exists then ask the user to overwrite
            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'move',
                payload: {
                    source_path: path.join(params.source_path, params.src),
                    dest_path: path.join(params.dest_path, params.dest),
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public download (params: any){
        return new Observable(subscriber => {

            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'download',
                payload: {
                    path: path.join(params.source_path, params.src)
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public archive (params: any){
        return new Observable(subscriber => {

            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'archive',
                payload: {
                    basePath: params.basePath,
                    files: params.files,
                    fileName: params.fileName,
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public extract (params: any){
        return new Observable(subscriber => {

            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'extract',
                payload: {
                    file: params.file,
                    dest_path: params.dest_path,
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public mkdir (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: `bucket`,
                api: 'fs',
                act: 'mkdir',
                payload: {
                    path: params.path,
                    name: params.name
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.httpService." + data.act + " not found");
        }
        return null;
    }

}