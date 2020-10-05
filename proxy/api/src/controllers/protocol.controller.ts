import {Controller, Get, Post, Res, Body, HttpStatus, Inject, Req} from '@nestjs/common';
import {Response, Request} from 'express';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {ConnectedSocket, MessageBody, SubscribeMessage} from '@nestjs/websockets';
import {WebsocketGatewayService} from "../services/websocket.gateway.service";

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
                name: 'hub',
                version: 'latest'
            }
        ],
    };


    constructor(
        @Inject('ProtocolService') private protocolService,
        private wsService: WebsocketGatewayService
        ) {
        this.protocolService.start().then(() => {
            this.registerModule({after: 0})
            //this.createWebSocket();
        });
    }

    //HTTPS protocol
    @Post('*')
    async onPost(@Res() res: Response, @Body() body: Body) {

        //TODO only send to registered pods
        await this.protocolService.sendPost({res, body});//TODO try to use events and subscribers
        res.status(HttpStatus.CREATED).send();
    }

    @Get('*')
    async onGet(@Res() res: Response, @Req() req: Request) {


        //TODO should receive a subscriber


        const payload = {
            ip: req.ip,
            hostname: req.hostname,
            query: req.query,
            params: req.params,
            headers: req.headers
        };
        const app_data = await this.protocolService.sendGet(payload);

        console.log(app_data)

        switch(app_data.type){
            case 'Buffer':
                res.status(HttpStatus.OK);
                res.end(Buffer.from(app_data.data));
                break;
        }


    }

    //Microservice protocol
    @MessagePattern({message: 'proxy'})
    public async onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'proxy'})
    public async onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    private createWebSocket() {
        this.wsService.subscribeToWs('session').subscribe((params) => {
            params.client.emit('ok');
        })
    }



    private registerModule(params) {
        return new Promise((resolve_register) => {
            setTimeout(async () => {
                try {
                    const moduleResponse = await this.protocolService.registerModule(this.config);

                    switch (moduleResponse.status) {
                        case 'failed':
                            console.log(moduleResponse);
                            switch (moduleResponse.resolution.action) {
                                case 'retry':
                                    await this.registerModule({
                                        after: moduleResponse.resolution.after
                                    });
                                    resolve_register(true);
                                    break;
                                case 'restart':
                                    console.log(JSON.stringify(moduleResponse));
                                    console.log('Proxy module cannot be registered');
                                    process.exit;

                                    break;
                                default:
                                    console.log(JSON.stringify(moduleResponse));
                                    throw new Error('Proxy module cannot be registered');

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

    private perform(data: payloadInterface) {
        try {
            //console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({act: data.act, payload: data.payload}) + ')');
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload});
        } catch (ex) {
            console.log(ex);
            return {
                message: 'Proxy could not find ' + data.api + ':' + data.act
            };
        }
    }

}
