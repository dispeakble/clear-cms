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
        version: '21.05.15',
        description: 'bucket module',
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
      @Inject('BucketService') private bucketService
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
    public onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'bucket'})
    public onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    async onPost(@Res() res: Response, @Req() req: Request, @UploadedFiles() files: Array<Express.Multer.File>) {
        try {
            const result = this.perform({
                channel: 'bucket',
                api: 'bucket',
                act: req.body.act || "nothing",
                payload: {
                    data: req.body,
                    files: files
                }
            });
            result.subscribe((data) => {
                console.log(data);
                res.write(data);
            }, (err) => {
                console.log(err);
                res.write(err);
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
                res.end();
            }, () => {
                console.log('complete')
                res.statusCode = 200;
                res.end();
            })
        } catch (err) {
            res.end(JSON.stringify(err));
        }
    }

    private perform(data: payloadInterface): Observable<any> {
        try {
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload}, this.config);
        } catch (ex) {
            //console.log(ex);
            return new Observable(subscriber => {
                subscriber.error({
                    message: 'Bucket could not find ' + data.api + ':' + data.act
                });
                subscriber.complete();
            });
        }
    }

}