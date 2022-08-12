import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import { ProtocolService } from "./protocol.service";
import { BucketService } from "./bucket.service";
import { Readable } from 'stream';

@Injectable()
export class AdminThemesService {

    private methods = ["get", "list", "add", "set", "rem"];

    constructor(private protocolService: ProtocolService, private bucketService: BucketService) {

    }

    private uploadFromBase64(params) {
        const initiator = new Observable(subscriber => {
            (async () => {
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

                await (() => new Promise((resolve) => {
                    setTimeout(resolve, 300);
                }))();

                const stream = Readable.from(buff);

                let index = 0;

                stream.on('data', (chunk: any) => {
                    index++;
                    subscriber.next({
                        payload: {
                            type: "data",
                            index: `${Math.random()}-${index}`,
                            buffer: chunk
                        }
                    });
                });

                stream.on('end', () => {
                    subscriber.complete();
                });

                stream.on('error', () => {
                    subscriber.error(`upload failed for ${params.filename}`);
                })
            })();
        });

        return this.bucketService.perform({
            act: 'upload',
            payload: {
                initiator: initiator
            }
        }).toPromise();
    }

    public list() {
        return new Observable((subscriber) => {
            const payload: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'list',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'adminTheme',
                        fields: ["id", "title", "isDefault", "thumbnail"]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('rows')) {
                    response = data.rows;
                }
                subscriber.next({type: 'admin_themes_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })

    }

    public get(params) {
        return new Observable((subscriber) => {
            const payload: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'adminTheme',
                        fields: params.fields || ["title", "isDefault", "thumbnail", "data"],
                        where: params.where,
                        limit: [0, 1]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'admin_theme', data: data});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        });
    }

    public async set(params) {

        if (params.data.isDefault) {
            const request: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'set',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'adminTheme',
                        where: {
                            isDefault: 1
                        },
                        data: {
                            isDefault: 0
                        }
                    }
                }
            };

            await this.protocolService.sendMessage(request).toPromise();
        }

        return new Observable((subscriber) => {
            const {title, isDefault, data} = params.data;
            const request: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'set',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'adminTheme',
                        where: params.where,
                        data: {
                            title,
                            isDefault,
                            data,
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(() => {
                subscriber.next({
                    success: "The theme was updated",
                    data: null
                });
            }, err => {
                subscriber.error(err);
            }, async () => {
                const parts = params.data.thumbnail.split(';base64,');
                const ext = parts[0].split('/');
                await this.uploadFromBase64({
                    filename: `${params.where.id}.${ext[1]}`,
                    base64: parts[1]
                });
                subscriber.complete();
            });
        });
    }

    public async add(params) {
        if (params.isDefault) {
            await this.set({
                where: {
                    isDefault: 1
                },
                data: {
                    isDefault: 0
                }
            })
        }
        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'add',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'adminTheme',
                        data: {
                            title: params.title,
                            isDefault: params.isDefault,
                            data: params.data,
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe((data) => {
                (async () => {
                    const parts = params.thumbnail.split(';base64,');
                    const ext = parts[0].split('/');
                    await this.uploadFromBase64({
                        filename: `${data.id}.${ext[1]}`,
                        base64: parts[1]
                    });
                    subscriber.next({
                        success: "The theme was added",
                        data: null
                    })
                    subscriber.complete();
                })()
            }, err => {
                subscriber.error(err);
            }, () => {

            });
        })

    }

    public rem(params) {
        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'rem',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'adminTheme',
                        where: params
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(() => {
                subscriber.next({
                    success: "The theme was removed",
                    data: null
                })
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
            console.log("System.adminThemes." + data.act + " not found");
        }
        return null;
    }

}