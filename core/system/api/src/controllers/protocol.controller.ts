import {Controller, Request, Res, UseGuards, Get, Post, HttpCode, Inject, Logger, HttpStatus} from '@nestjs/common';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Observable} from "rxjs";
import {LocalAuthGuard} from "../services/auth/common/guards/local-auth.guard";
import {JwtAuthGuard} from "../services/auth/common/guards/jwt-auth.guard";
import {JwtUpdateAuthGuard} from "../services/auth/common/guards/jwtUpdate-auth.guard";
import {JwtRtAuthGuard} from "../services/auth/common/guards/jwtRt-auth.guard";

@Controller('/')
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    private moduleConfig: ModuleInterface = {
        name: `${process.env.app}_system`,
        version: '21.07.26',
        description: 'System Module',
        started: new Date(),
        config: {
            channel: `${process.env.app}_system`,
            permissions: {
                stop: false,
                restart: true,
                ports: [80]
            }
        },
        dependencies: [{
            name: `${process.env.app}_hub`,
            version: 'latest'
        }, {
            name: `${process.env.app}_proxy`,
            version: 'latest'
        }]
    };

    private state: any = {
        ready: false
    };

    private mainService;

    constructor(
        @Inject('SystemService') private systemService,
        @Inject('ProtocolService') private protocolService,
        @Inject('AdminProfileService') private adminProfileService,
        @Inject('AdminThemesService') private adminThemesService,
        @Inject('PublicThemesService') private publicThemesService,
        @Inject('AuthService') private authService,
        @Inject('BucketService') private bucketService,
        @Inject('CategoriesService') private categoriesService,
        @Inject('ClientsService') private clientsService,
        @Inject('PagesService') private pagesService,
        @Inject('GeneralSettingsService') private generalSettingsService,
        @Inject('DashboardBoxService') private dashboardBoxService,
        @Inject('SitemapService') private sitemapService,
        @Inject('ResourcesService') private resourcesService,
        @Inject('ResetEmailService') private resetEmailService,
    ){


    }

    @MessagePattern({message: `${process.env.app}_system`})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: `${process.env.app}_system`})
    public onEvent(@Payload() payload: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(payload);
    }

    async onApplicationBootstrap() {

        try {
            await this.protocolService.start();

            const data = await this.systemService.registerModule(this.moduleConfig);
            if(!data) {
                console.log('Cannot register system microservice');
                process.exit(1);
            }

            this.state.ready = true;
            this.mainService = this;

            await this.protocolService.sendMessage({
                channel: `${process.env.app}_hub`,
                api: 'module',
                act: 'mapPort',
                payload: {
                    channel: `${process.env.app}_system`,
                    target: `${process.env.app}_proxy`,
                    port: process.env.backend_port,
                    defaults: {
                        url: '/',
                        login: '/view-auth'
                    }
                }
            }).toPromise();

            this.logger.log('System application started', process.env.backend_port)
            console.log('System application started', process.env.backend_port);
        } catch (err) {
            console.log(err);
            console.log('cannot start system api');
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('api/auth/login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
        try{
            return await this.authService.login(req.user);
        } catch(err) {
            console.error(err)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/user/profile')
    async getProfile(@Request() req) {
        return await this.authService.getProfile(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('api/auth/logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
        return await this.authService.logout(req.user);
    }

    @UseGuards(JwtUpdateAuthGuard)
    @Post('api/user/update')
    @HttpCode(HttpStatus.OK)
    async update(@Request() req) {
        // eslint-disable-next-line no-console
        if(req.user){
            return await this.authService.update(req.body, req.user);
        }
        return HttpStatus.FORBIDDEN
    }

    @UseGuards(JwtAuthGuard)
    @Post('/api/user/checkPassword')
    @HttpCode(HttpStatus.OK)
    async checkPassword(@Request() req) {
        // eslint-disable-next-line no-console
        if(req.user){
            return await this.authService.checkPassword(req.body, req.user);
        }
        return HttpStatus.FORBIDDEN
    }

    @UseGuards(JwtAuthGuard)
    @Post('/api/user/updatePassword')
    @HttpCode(HttpStatus.OK)
    async updatePassword(@Request() req) {
        // eslint-disable-next-line no-console
        if(req.user){
            return await this.authService.updatePassword(req.body, req.user);
        }
        return HttpStatus.FORBIDDEN
    }

    @UseGuards(JwtRtAuthGuard)
    @Post('api/auth/refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Request() req) {
        return "zbila"
    }

    @Get('api/auth/recaptcha')
    @HttpCode(HttpStatus.OK)
    async isHuman(@Request() req){
        return await this.authService.isHuman(req.query.token)
    }

    private perform(params: payloadInterface) {
        try {
            if(!this.state.ready) {
                return new Observable((subscriber) => {
                    subscriber.next({
                        data: 'not ready'
                    });
                });
            }
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
