import {Controller, Get, Post, Res, Body, HttpStatus, Request, Inject} from '@nestjs/common';
import {Response} from 'express';
//import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class ProtocolController {

    private config: ModuleInterface = {
        name: 'proxy',
        version: '20.07.19',
        description: 'proxy module',
        started: new Date(),
        config: {
            restart: true,
            stop: false
        },
        dependencies: [
            {
                name: 'system',
                version: 'latest'
            },
            {
                name: 'hub',
                version: 'latest'
            }
        ],
    };

    constructor(
        @Inject('ProtocolService') private protocolService) {
        this.protocolService.start().then(() => {
            this.registerModule({after: 1})
        });

    }

    //HTTPS protocol
    @Post()
    async onPost(@Res() res: Response, @Body() body: Body) {

        await this.protocolService.sendPost({res, body});//TODO try to use events and subscribers
        res.status(HttpStatus.CREATED).send();
    }

    @Get()
    async onGet(@Res() res: Response, @Request() req: Request) {
        //TODO can be changed by any module live.
        //TODO should receive a subscriber
        //TODO map ports to different modules if needed
        //TODO map paths to different modules if needed

        const headers = req.headers;
        const app_data = await this.protocolService.sendGet(headers);//TODO try to use events and subscribers

        res.status(HttpStatus.OK);
        res.send(app_data);
    }

    //Microservice protocol
    @MessagePattern({message: 'proxy'})
    public async onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'proxy'})
    public async onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    private registerModule(params) {
        return new Promise((resolve_register) => {
            setTimeout(async () => {
                try {
                    const moduleResponse = await this.protocolService.registerModule(this.config);

                    switch (moduleResponse.status) {
                        case 'failed':
                            switch (moduleResponse.resolution.action) {
                                case 'retry':
                                    await this.registerModule({
                                        after: moduleResponse.resolution.after
                                    });
                                    resolve_register(true);
                                    break;
                                default:
                                    resolve_register(true);
                                    console.log(moduleResponse);
                                    break;
                            }
                            break;
                        case 'registered':
                            resolve_register(true);
                            console.log('Proxy module registered');
                            break;
                    }

                } catch (ex) {
                    resolve_register(true);
                    console.log(ex);
                }

            }, params.after * 1000);
        });

    }

    private perform(data: payloadInterface){
        try {
            //console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({act: data.act, payload: data.payload}) + ')');
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload});
        } catch (ex) {
            console.log(ex);
            return {
                message:'Proxy could not find ' + data.api + ':' + data.act
            };
        }
    }

}
