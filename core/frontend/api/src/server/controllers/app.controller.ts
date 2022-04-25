// @ts-ignore
import {Body, Controller, Get, HttpStatus, Inject, Logger, Req, Res} from '@nestjs/common';
import {EventPattern, MessagePattern, Payload} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {FsResponse} from "../interfaces/fs.interface";
import {ViewService} from '../services/view.service';
import {Request, Response} from "express";
import {parse} from "url";
// @ts-ignore
import {Observable} from "rxjs";
import {ProtocolService} from "../services/protocol.service";
import {SystemService} from "../services/system.service";
import {PublicThemesService} from "../services/publicThemes.service";
import {CategoriesService} from "../services/categories.service";
import {PagesService} from "../services/pages.service";
import {BucketService} from "../services/bucket.service";
import {AgencyService} from "../services/agency.service";

@Controller('/')
export class AppController {

    public logger: Logger = new Logger('App.Controller');
    private moduleConfig: ModuleInterface = {
        name: `${process.env.app}_frontend`,
        version: '22.04.12',
        description: 'Frontend Module',
        started: new Date(),
        config: {
            restart: true,
            stop: false
        },
        dependencies: [{
            name: `${process.env.app}_hub`,
            version: 'latest'
        }, {
            name: `${process.env.app}_frontendproxy`,
            version: 'latest'
        }]
    };

    private state: any = {
        ready: false
    };

    private mainService;

    constructor(
        @Inject('ProtocolService') private protocolService: ProtocolService,
        @Inject('SystemService') private systemService: SystemService,
        @Inject('PublicThemesService') private publicThemesService: PublicThemesService,
        @Inject('CategoriesService') private categoriesService: CategoriesService,
        @Inject('PagesService') private pagesService: PagesService,
        @Inject('BucketService') private bucketService: BucketService,
        @Inject('AgencyService') private agencyService: AgencyService,

        private viewService: ViewService
    ) {
        this.state.ready = true;
        this.mainService = this;
    }

    @MessagePattern({message: `${process.env.app}_frontend`})
    public onMessage(@Payload() data: payloadInterface) {
        return this.perform(data);
    }

    @EventPattern({event: `${process.env.app}_frontend`})
    public onEvent(@Payload() payload: payloadInterface) {
        return this.perform(payload);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();

        const reg_msg = await this.systemService.registerModule(this.moduleConfig);
        this.logger.log(reg_msg);
        const port_map_msg = await this.protocolService.sendMessage({
            channel: `${process.env.app}_hub`,
            api: 'module',
            act: 'mapPort',
            payload: {
                channel: `${process.env.app}_frontend`,
                target: `${process.env.app}_frontendproxy`,
                port: process.env.backend_port,
                defaults: {
                    url: '/'
                }
            }
        }).toPromise();

        this.logger.log(port_map_msg);

        this.logger.log('Frontend api application started');
    }



    @Get('_next*')
    public async assets(@Req() req: Request, @Res() res: Response) {
        await this.viewService.handler(req, res);
    }


    @Get('files/*')
    public async getFiles(@Req() req: Request, @Res() res: Response) {
        req.params[0] = `files/${req.params[0]}`;
        const fileReq = {
            channel: `${process.env.app}_frontend`,
            payload: {
                ip: req.ip,
                hostname: req.hostname,
                params: req.params,
                headers: req.headers,
                query: req.query
            }
        };

        const fileStats = await this.bucketService.getMeta(fileReq.payload);
        if(!fileStats) {
            res.status(HttpStatus.NOT_FOUND);//TODO ADD A 404 PAGE
            res.end();
            return;
        }

        const getSubscriber = this.bucketService.get(fileReq.payload);


        let bigBuffer = Buffer.alloc(0);
        const file_meta = {
            content_length: 0,
            content_type: ''
        };

        getSubscriber.subscribe((data: FsResponse) => {
            try {
                switch (data.type) {
                    case "meta":
                        AppController.filesResponse({res, file: data, fileStats});

                        file_meta.content_type = data.content_type;
                        file_meta.content_length = data.content_length;
                        break;
                    case "Buffer":
                        bigBuffer = Buffer.concat([bigBuffer, Buffer.from(data.data)]);
                        res.write(Buffer.from(data.data));
                        break;
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
            }

        }, (error: any) => {
            this.logger.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }, () => {
            res.end();

        });
    }

    @Get('api/agency/hotel')
    public async hotels(@Req() req: Request, @Res() res: Response) {
        try{

            const data = await this.agencyService.getHotels()
            return res.json(data)
        }catch(err){
            // eslint-disable-next-line no-console
            console.log(err)
        }
    }

    @Get('api/*')
    public async api(@Req() req: Request) {
        //TODO get the db from a
        const parts = req.url.split('/');
        return await this.perform({
            channel: `${process.env.app}_db`,
            api: 'sql',
            act: 'get',
            payload: {
                db: parts[2],
                channel: `${process.env.app}_frontend`,
                data: {
                    what: parts[3],
                }
            }
        }).toPromise();
    }





    @Get('*')
    public async showHome(@Req() req: Request, @Res() res: Response) {
        const url = parse(req.url, true);
        const mockRequest = {
            headers: {

            },
            url: req.url,
            params: req.params
        }
        await this.viewService.handler(mockRequest, res, url);
    }

    @Get('api/results-data')
    public async resultsData(@Res() res: Response, @Body() body: Body){
        const {page} = body
        const dummy = [[
            {
            itemTitle: "Lorem ipsum - page1",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                itemTitle: "Lorem ipsum",
                itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                itemTitle: "Lorem ipsum",
                itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                itemTitle: "Lorem ipsum",
                itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                itemTitle: "Lorem ipsum",
                itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            }],
        [
            {
            itemTitle: "Lorem ipsum - page2",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }],
        [
            {
            itemTitle: "Lorem ipsum - page 3",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            itemTitle: "Lorem ipsum",
            itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }]]
        const ret = {
            "results": dummy.slice((page-1), page),
            "page": page,
            "hasMore": page<dummy.length,

        }
        return res.status(HttpStatus.OK).json(ret)
    }

    private static filesResponse(params: any) {
        const { res, file, fileStats } = params;
        res.set("Content-Type", file.content_type);
        res.set("Content-Length", file.content_length);
        res.set('Content-Security-Policy', "img-src 'self'; default-src 'self'; script-src 'self'; style-src 'unsafe-inline' 'self' https://fonts.googleapis.com *.fontawesome.com; font-src 'self' data: https://fonts.gstatic.com *.fontawesome.com");
        res.set('X-Frame-Options', 'SAMEORIGIN');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Strict-Transport-Security', 'max-age=604800; includeSubDomains; preload');
        res.set('Cache-Control', 'public, max-age=604800');
        res.set('ETag', fileStats.data.etagId);
        res.status(HttpStatus.OK);
        if(params.finish) {
            res.write(Buffer.from(file.data.data));
            res.end();
        }
    }

    private static apiResponse(params: any) {
        const { res, data } = params;
        res.set("Content-Type", "application/json");
        res.set("Content-Length", params.data.length);
        res.set('Content-Security-Policy', "img-src 'self'; default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'");
        res.set('X-Frame-Options', 'SAMEORIGIN');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Strict-Transport-Security', 'max-age=0; includeSubDomains; preload');
        res.set('Cache-Control', 'no-cache, private, must-revalidate, max-stale=0, post-check=0, pre-check=0 no-store');
        res.set('Pragma', 'no-cache');
        res.set('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT');

        res.status(HttpStatus.OK);
        if(params.finish) {
            res.write(Buffer.from(data));
            res.end();
        }
    }

    private perform(params: payloadInterface) {
        try {

            if(!this.state.ready) {
                return new Observable((subscriber: any) => {
                    subscriber.next({
                        data: 'not ready'
                    });
                });
            }

            const callback = (response:any) => {
                return this.perform(response)
            }

            params.payload = Object.assign({}, params.payload, {perform: callback})
            // @ts-ignore
            return this[params.api + 'Service'].perform(params, this.moduleConfig);

        } catch (ex) {
            return {
                error: 'Could not find ' + params.api + ':' + params.act
            };
        }
    }

}
