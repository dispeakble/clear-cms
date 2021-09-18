import {Controller, Get, Inject, Logger, Req, Res} from '@nestjs/common';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import { ViewService } from '../services/view.service';
import {Request, Response} from "express";

@Controller('/')
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    private moduleConfig: ModuleInterface = {
        name: 'frontend',
        version: '21.08.04',
        description: 'Frontend Module',
        started: new Date(),
        config: {
            channel: 'frontend',
            permissions: {
                stop: false,
                restart: true,
                ports: [80]
            }
        },
        dependencies: [{
            name: 'hub',
            version: 'latest'
        }, {
            name: 'frontendproxy',
            version: 'latest'
        }]
    };

    private mainService;

    constructor(
        @Inject('FrontendService') private frontendService,
        @Inject('ProtocolService') private protocolService,
        @Inject('PublicThemesService') private publicThemesService,
        @Inject('AuthService') private authService,
        @Inject('BucketService') private bucketService,
        @Inject('CategoriesService') private categoriesService,
        @Inject('PagesService') private pagesService,
        private viewService: ViewService
    ) {
        this.mainService = this;
    }

    @MessagePattern({message: 'frontend'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'frontend'})
    public onEvent(@Payload() payload: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(payload);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();

        const payload: ModuleInterface = {
            name: 'frontend',
            version: '21.08.28',
            description: 'the frontend api and client',
            started: new Date(),
            config: {
                restart: true,
                stop: false
            },
            dependencies: [{
                name: 'hub',
                version: 'latest'
            },{
                name: 'frontendproxy',
                version: 'latest'
            }]
        };

        const reg_msg = await this.frontendService.registerModule(payload).toPromise();
        this.logger.log(reg_msg);
        const port_map_msg = await this.protocolService.sendMessage({
            channel: 'hub',
            api: 'module',
            act: 'mapPort',
            payload: {
                channel: 'frontend',
                target: 'frontendproxy',
                port: process.env.backend_port,
                defaults: {
                    url: '/'
                }
            }
        }).toPromise();

        this.logger.log(port_map_msg);

        this.logger.log('Frontend application started');
    }

    @Get('*')
    public async showHome(@Req() req: Request, @Res() res: Response) {
        await this.viewService.handler(req, res);
    }

    @Get('_next*')
    public async assets(@Req() req: Request, @Res() res: Response) {
        await this.viewService.handler(req, res);
    }

    @Get('favicon.ico')
    public async favicon(@Req() req: Request, @Res() res: Response) {
        await this.viewService.handler(req, res);
    }

    private perform(params: payloadInterface) {
        try {
            const callback = (response) => {
                return this.perform(response)
            }
            params.payload = Object.assign({}, params.payload, {perform: callback})
            return this[params.api + 'Service'].perform(params, this.moduleConfig);
        } catch (ex) {
            return {
                error: 'Could not find ' + params.api + ':' + params.act
            };
        }
    }

}
