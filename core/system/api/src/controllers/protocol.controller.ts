import {Controller, Inject, Logger} from '@nestjs/common';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Observable} from "rxjs";

@Controller()
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    private moduleConfig: ModuleInterface = {
        name: 'system',
        version: '21.07.26',
        description: 'System Module',
        started: new Date(),
        config: {
            channel: 'system',
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
            name: 'proxy',
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
        @Inject('UsersService') private usersService,
        @Inject('PagesService') private pagesService,
        @Inject('GeneralSettingsService') private generalSettingsService,
        @Inject('DashboardBoxService') private dashboardBoxService,
        @Inject('SitemapService') private sitemapService,
        @Inject('ProductsService') private productsService,
        @Inject('ProductLabelsService') private productLabelsService,
        @Inject('ProductLocalityService') private productLocalityService,
        @Inject('ProductPricesService') private productPricesService,
        @Inject('EcommerceTemplatesService') private ecommerceTemplatesService){


    }

    @MessagePattern({message: 'system'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'system'})
    public onEvent(@Payload() payload: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(payload);
    }

    async onApplicationBootstrap() {

        try {
            await this.protocolService.start();

            const data = await this.systemService.registerModule(this.moduleConfig);
            if(!data) {
                console.log('Cannot regiter system microservice');
                process.exit(1);
            }

            this.state.ready = true;
            this.mainService = this;

            const payload: ModuleInterface = {
                name: 'system',
                version: '21.01.12',
                description: 'the system api and client',
                started: new Date(),
                config: {
                    restart: true,
                    stop: false
                },
                dependencies: [{
                    name: 'hub',
                    version: 'latest'
                },{
                    name: 'proxy',
                    version: 'latest'
                }]
            };

            await this.protocolService.sendMessage({
                channel: 'hub',
                api: 'module',
                act: 'mapPort',
                payload: {
                    channel: 'system',
                    target: 'proxy',
                    port: process.env.backend_port,
                    defaults: {
                        url: '/',
                        login: '/view-auth'
                    }
                }
            }).toPromise();

            this.logger.log('System application started')
            console.log('System application started');
        } catch (err) {
            console.log(err);
            console.log('cannot start system api');
        }


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
