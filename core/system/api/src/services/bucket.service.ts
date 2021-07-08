import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";
import {
    GotService
} from "@t00nday/nestjs-got";

@Injectable()
export class BucketService {

    private methods = ["checkAccess", "getMeta", "info", "get", "chmod", "chown", "list", "completePath", "upload", "read", "rename", "move", "download", "copy", "rm", "mkdir", "recycle", "archive", "extract"];
    private bucketUrl = process.env.bucket_server;
    private publicPaths = ["/view-auth", "/static", "/manifest.json"];//TODO GET THIS FROM A CONFIG


    constructor(@Inject('ProtocolService') private protocolService, private gotService: GotService) {
    }

    private info(params: any, options: any) {
        return new Promise((resolve) => {
            try {
                const metaPayload: payloadInterface = {
                    channel: 'bucket',
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
                console.log(err);
                resolve(err);
            }

        });
    }

    private read(params: any) {
        return new Observable((observer) => {
            try {
                (async () => {
                    const stats = await this.getMeta({path: params.path, defaultFileName: 'index.html'});
                    observer.next({type: 'meta', content_length: stats['size'], content_type: mime.getType(stats['file_name']), file_name: stats['file_name']});

                    this.gotService.get(`${this.bucketUrl}/${params.path}`, {}).subscribe((data) => {
                        observer.next({type: 'Buffer', data});
                    }, (err) => {
                        observer.error(err);
                        observer.complete();
                    }, () => {
                        observer.complete();
                    });
                })();
            } catch (err) {
                observer.error(err);
                observer.complete();
            }
        });
    }

    private upload(params: any, config){
        return new Observable(subscriber => {

            const handshake = params.perform({
                channel: config.config.channel,
                api: 'protocol',
                act: 'startHandshake',
                payload: {
                    channel: 'bucket',
                    indication: {
                        api: 'fs',
                        act: 'upload'
                    }
                }
            })

            handshake.theObserver.subscribe(data => {
                //console.log(data);
            }, err => {
                console.log(err);
            }, () => {
                console.log('upload complete');
            })

            handshake.thePromise.then(handshakeResponse => {
                params.initiator.subscribe(data => {
                    handshakeResponse.thePusher.next(data)
                }, err => {
                    console.log(err);
                    subscriber.complete()
                }, () => {
                    console.log('uploaded complete')
                    subscriber.complete();
                });

                subscriber.next('.');
            });

        });
    }

    private checkPaths(data: any){
        const params = data.params;
        let file_name = '';

        if (data.params[0] && data.params[0].length) {
            file_name = params[0];
        }
        this.publicPaths.forEach((e, i) => {
            if(file_name.indexOf(e) === 0){
                return true;
            }
        });
        return false;
    }

    public checkAccess(data: any) {
        return new Promise((resolve) => {
            if(!this.checkPaths(data)){
                return resolve({
                    access: false,
                    status: HttpStatus.TEMPORARY_REDIRECT,
                    location: this.publicPaths[0]
                });
            }

            return resolve({
                access: true
            });
        });
    }

    public getMeta(data: any) {
        return new Promise((resolve) => {

            const params = data.params;
            let file_name = '';

            if (data.params[0] && data.params[0].length) {
                file_name = params[0];
            }

            try {
                const file_path = __dirname + '/../../public/';
                if (!fs.existsSync(file_path + file_name)) {
                    file_name = data.defaultFileName;
                }
                const stats = fs.statSync(file_path + file_name);
                const etagId = etag.default(Buffer.from(JSON.stringify(stats)));
                resolve({modified: stats.mtimeMs, size: stats.size, "etagId": etagId, file_name: file_name});
            } catch (err) {
                console.log(err);
            }

        });
    }

    public get(data: any) {
        return new Observable((observer) => {
            const params = data.params;
            let file_name = 'index.html';

            if (data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1) {
                file_name = params[0];
            }

            try {
                let file_path = __dirname + '/../../public/' + file_name;
                if (!fs.existsSync(file_path)) {
                    file_name = 'index.html';
                    file_path = __dirname + '/../../public/index.html';
                }

                const stats = fs.statSync(file_path);
                observer.next({type: 'meta', content_length: stats.size, content_type: mime.getType(file_name)});

                const readStream = fs.createReadStream(file_path, {highWaterMark: 52428800});

                readStream.on('data', function (chunk) {
                    console.log('Buffering - ' + file_name);
                    observer.next(chunk);
                }).on('end', function () {
                    console.log('Done - ' + file_name);
                    observer.complete();
                });
            } catch (err) {
                fs.readFile(__dirname + '/../../public/index.html', (err, buffer) => {
                    observer.next(buffer);
                    observer.complete();
                });
            }
        });
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'bucket',
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
                channel: 'bucket',
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
                channel: 'bucket',
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
                channel: 'bucket',
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
            console.log("bucket service",params)
            const payload: payloadInterface = {
                channel: 'bucket',
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
                channel: 'bucket',
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
                channel: 'bucket',
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

    public mkdir (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'bucket',
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