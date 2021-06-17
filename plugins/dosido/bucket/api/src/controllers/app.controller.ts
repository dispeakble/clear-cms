import {
    Body, Controller, Get, Inject, Next, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors
} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {AnyFilesInterceptor} from "@nestjs/platform-express";
import {Request, Response} from "express";
import {Observable} from "rxjs";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'bucket',
        version: '21.05.16',
        description: 'CMS Bucket Module',
        started: new Date(),
        config: {
            restart: true,
            stop: false
        },
        dependencies: [
            {
                name: 'hub',
                version: 'latest'
            }
        ],
    };

    constructor(
      @Inject('ProtocolService') private protocolService,
      @Inject('SystemService') private systemService,
      @Inject('FsService') private fsService
    ) {
        this.protocolService.start().then(() => {
            this.systemService.registerModule(this.config).subscribe((response) => {
                console.log(response);
            }, (err) => {
                console.error(err);
            }, () => {
                console.log('complete');
            });

        })
    }

    //Microservice protocol
    @MessagePattern({message: 'bucket'})
    public onMessage(@Payload() data: any) {
        return this.perform(data);
    }

    @EventPattern({event: 'bucket'})
    public onEvent(@Payload() data: any) {
        return this.perform(data);
    }

    /*@Post()
    @UseInterceptors(AnyFilesInterceptor())
    async onPost(@Res() res: Response, @Req() req: Request, @UploadedFiles() files: Array<Express.Multer.File>) {
        try {
            const result = this.perform({
                channel: 'bucket',
                api: 'fs',
                act: "uploadFiles",
                payload: {
                    data: req.body,
                    files: files
                }
            });
            result.subscribe((data) => {
                res.write(JSON.stringify(data));
            }, (err) => {
                res.write(JSON.stringify(err));
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
                res.end();
            }, () => {
                res.statusCode = 200;
                res.end();
            })
        } catch (err) {
            res.end(JSON.stringify(err));
        }
    }*/

    private perform(params: payloadInterface): Observable<any> {
        try {
            switch(params.type){
                default:
                    return this[params.api + 'Service'].perform(params, this.config);
                    break;
                case 'handshake':
                    params.payload.callbacks = {
                        onData: data => {
                            //console.log(data);
                            this.perform({
                                channel: 'system',
                                api: 'bucket',
                                act: 'uploadFiles',
                                payload: data
                            }).subscribe(response => {
                                console.log(response);
                            }, err => {
                                //TODO send to caller the error
                                console.log(err);
                            }, () => {

                            });
                        },
                        onError: err => {
                            console.log(err);
                        },
                        onComplete: () => {
                            console.log('handshake finished');
                        }
                    };
                    this[params.api + 'Service'].perform(params).subscribe(response => {
                        this.perform({
                            channel: params.channel,
                            api: params.api,
                            act: params.act,
                            payload: response
                        })
                    }, err => {
                        console.log(err);
                    }, () => {
                        console.log('handshake complete')
                    });
                    break;
            }

        } catch (ex) {
            return new Observable(subscriber => {
                subscriber.error('Could not find ' + params.api + ':' + params.act);
                subscriber.complete();
            });
        }
    }

}