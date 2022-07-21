import {Controller, Inject, Logger} from '@nestjs/common';
import {EventPattern, MessagePattern, Payload} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Observable} from "rxjs";
import {ResourcesService} from "../services/resources.service";
import { DashboardBoxService } from "../services/dashboardBox.service";
import { AdminThemesService } from "../services/adminThemes.service";
import { ProtocolService } from "../services/protocol.service";
import { CategoriesService } from "../services/categories.service";
import { PublicThemesService } from "../services/publicThemes.service";
import { PagesService } from "../services/pages.service";
import { BucketService } from "../services/bucket.service";
import { SitemapService } from "../services/sitemap.service";
import { ClientsService } from "../services/clients.service";
import { GeneralSettingsService } from "../services/generalSettings.service";
import { SystemService } from "../services/system.service";
import { AdminProfileService } from "../services/adminProfile.service";
import { AuthService } from "../services/auth.service";

@Controller()
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    private moduleConfig: ModuleInterface = {
        name: `system`,
        version: '21.07.26',
        description: 'System Module',
        started: new Date(),
        config: {
            channel: `system`,
            permissions: {
                stop: false,
                restart: true,
                ports: [80]
            }
        },
        dependencies: [{
            name: `hub`,
            version: 'latest'
        }, {
            name: `proxy`,
            version: 'latest'
        }]
    };

    private state: any = {
        ready: false
    };

    private mainService;

    constructor(
        private systemService: SystemService,
        private protocolService: ProtocolService,
        private adminProfileService: AdminProfileService,
        private adminThemesService: AdminThemesService,
        private publicThemesService: PublicThemesService,
        private authService: AuthService,
        private bucketService: BucketService,
        private categoriesService: CategoriesService,
        private clientsService: ClientsService,
        private pagesService: PagesService,
        private generalSettingsService: GeneralSettingsService,
        private dashboardBoxService: DashboardBoxService,
        private sitemapService: SitemapService,
        private resourcesService: ResourcesService,
    ){


    }

    @MessagePattern({message: `${process.env.app}_system`})
    public onMessage(@Payload() data: payloadInterface) {
        return this.perform(data);
    }

    @EventPattern({event: `${process.env.app}_system`})
    public onEvent(@Payload() payload: payloadInterface) {
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
                channel: `hub`,
                api: 'module',
                act: 'mapPort',
                payload: {
                    channel: `system`,
                    target: `proxy`,
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
            console.log(err.message);
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
