import {
    ArgumentsHost,
    Catch,
    Controller,
    Get,
    HttpStatus,
    Inject,
    Post,
    Req,
    Res,
    Session, UnauthorizedException,
    UseGuards
} from "@nestjs/common";
import {Request, Response} from "express";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {HttpAuthGuard} from "../guards/http.auth.guard";

@Controller()
export class AppController {

    private portMap = {};

    constructor(
        @Inject('ProtocolService') private protocolService,
        @Inject('SystemService') private systemService,
        @Inject('AppService') private appService,
        @Inject('SessionService') private sessionService,
        @Inject('WsGateway') private wsGateway
    ) {
        this.protocolService.start().then(async () => {
            this.portMap = await this.protocolService.getValue('portMap');
            const payload: ModuleInterface = {
                name: 'proxy',
                version: '20.12.18',
                description: 'the main http proxy (gateway)',
                started: new Date(),
                config: {
                    restart: true,
                    stop: false
                },
                dependencies: [{
                    name: 'hub',
                    version: 'latest'
                }]
            };
            const response = await this.systemService.registerModule(payload);
            console.log(response);
            this.wsGateway.registerCallbacks({
                callbacks: {
                    "onMessage": async (params) => {
                        const response = await this.onMessage(params);
                        return response;
                    }
                }
            });
        })
    }

    @Post('/')
    async onPost(@Res() res: Response, @Req() req: Request, @Session() session) {

        const port = req.headers.host.split(':')[1];
        const channel = this.portMap[port];

        const payload = {
            channel: req.body.module,
            api: req.body.api,
            act: req.body.act,
            payload: {
                ip: req.ip,
                hostname: req.hostname,
                body: req.body,
                params: req.params,
                headers: req.headers
            }
        };

        const response = await this.protocolService.sendPost(payload);

        if (response && response.callback) {
            const callback = response.callback;
            const cb_payload = {
                channel: channel,
                api: callback.api,
                act: callback.act,
                payload: {data: callback.payload, session: session}
            };
            response.data = await this.perform(cb_payload);
            res.setHeader("Content-Type", response['mime']);
            res.status(HttpStatus.OK);

            switch (response.mime) {
                case 'application/json':
                    res.end(JSON.stringify(response.data));
                    break;
                case 'Buffer':
                    res.end(Buffer.from(response.file.data));
                    break;
        }


        }
    }

    @UseGuards(HttpAuthGuard)
    @Get('*')
    async onGet(@Res() res: Response, @Req() req: Request, @Session() session) {

        const port = req.headers.host.split(':')[1];
        const channel = this.portMap[port];

        const payload = {
            channel: channel,
            payload: {
                ip: req.ip,
                hostname: req.hostname,
                query: req.query,
                params: req.params,
                headers: req.headers
            }
        };

        const app_data = await this.protocolService.sendGet(payload);
        if(app_data){
            res.setHeader("Content-Type", app_data['mime']);

            switch (app_data.file.type) {
                case 'Buffer':
                    res.status(HttpStatus.OK);
                    res.end(Buffer.from(app_data.file.data));
                    break;
            }
        } else {
            res.status(HttpStatus.NOT_FOUND);
            res.end();
        }



    }

    async onApplicationBootstrap() {
        this.appService.perform({
            api: 'app',
            act: 'portMappingListen',
            payload: {
                callback: async (data) => {
                    let portMap = await this.protocolService.getValue('portMap');
                    if (!portMap) {
                        portMap = {};
                    }
                    portMap = Object.assign({}, portMap || {}, data);
                    await this.protocolService.setValue('portMap', portMap);

                    this.portMap = data;
                }
            }
        });
    }

    private onMessage(params) {
        return new Promise(async (resolve) => {
            //console.log('got message from gateway', params)

            const data = params.data;

            const payload: payloadInterface = {
                channel: data.module,
                api: data.api,
                act: data.act,
                payload: data.payload
            };

            const response = {
                id: params.id,
                data: null
            }
            try {
                response.data = await this.protocolService.sendMessage(payload);

                if (response.data.callback) {
                    const callback = response.data.callback;
                    const cb_payload = {
                        channel: params.module,
                        api: callback.api,
                        act: callback.act,
                        payload: {data: callback.payload, client: params.client}
                    };
                    response.data = await this.perform(cb_payload);
                }
            } catch (err) {
                console.log(err);
            }

            resolve(response);

        })
    }

    private perform(data: payloadInterface) {
        try {
            console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({
                act: data.act
            }) + ')');
            const api = data.api;
            const apiName = api + 'Service';
            const payload = {act: data.act, payload: data.payload};
            return this[apiName].perform(payload);
        } catch (ex) {
            return {
                status: 500,
                message: 'App.Controller.ts: Invalid ' + data.api + ':' + data.act
            };
        }
    }

}