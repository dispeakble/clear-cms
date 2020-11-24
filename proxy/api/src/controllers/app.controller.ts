import {Body, Controller, Get, HttpStatus, Inject, Post, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class AppController {

    private portMap = {};

    constructor(
        @Inject('ProtocolService') private protocolService,
        @Inject('SystemService') private systemService,
        @Inject('AppService') private appService,
        @Inject('WsGateway') private wsGateway
    ) {
        this.protocolService.start().then(async () => {
            let payload: ModuleInterface = {
                name: 'proxy',
                version: '20.10.25',
                description: 'the main http proxy (gateway)',
                started: new Date(),
                config: {
                    restart: true,
                    stop: false
                },
                dependencies: [{
                    name: 'hub',
                    version: 'latest'
                }],
            };
            let response = await this.systemService.registerModule(payload);
            console.log(response);
            //TODO make a retry. copy from protocol.controllers.ts

            this.wsGateway.registerCallbacks({
                callbacks: {
                    "onMessage": async (params) => {
                        const response = await this.onMessage(params);
                        return response
                    }
                }
            });
        })
    }

    private onMessage(params){
        return new Promise((resolve) => {
            console.log('got message from gateway', JSON.stringify(params))

            const payload: payloadInterface = {
                channel: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            };

            this.protocolService.sendMessage(payload).then((moduleResponse) => {
                let response = {
                    id: params.id,
                    data: moduleResponse
                }

                resolve(response);
            });

        })
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

        let port = req.headers.host.split(':')[1];
        let channel = this.portMap[port];

        const payload = {
            channel: channel,
            payload:{
                ip: req.ip,
                hostname: req.hostname,
                query: req.query,
                params: req.params,
                headers: req.headers
            }

        };
        //console.log(payload)
        const app_data = await this.protocolService.sendGet(payload);

        res.setHeader("Content-Type", app_data['mime']);

        //console.log(app_data)

        switch (app_data.file.type) {
            case 'Buffer':
                res.status(HttpStatus.OK);
                res.end(Buffer.from(app_data.file.data));
                break;
        }

    }

    async onApplicationBootstrap() {
        this.appService.perform({
            api:'app',
            act:'portMappingListen',
            payload:{
                cb:(data) => {
                    this.portMap = data;
                }
            }
        });
    }

}