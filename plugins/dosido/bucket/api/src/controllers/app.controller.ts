import {
    Controller, Inject
} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {Observable} from "rxjs";

@Controller()
export class AppController {

    private moduleConfig: ModuleInterface = {
        name: 'bucket',
        version: '21.05.16',
        description: 'CMS Bucket Module',
        started: new Date(),
        config: {
            channel: 'bucket',
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

    private state: any = {
        ready: false
    };

    constructor(
        @Inject('ProtocolService') private protocolService,
        @Inject('SystemService') private systemService,
        @Inject('FsService') private fsService
    ) {

    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        const data = await this.systemService.registerModule(this.moduleConfig);
        console.log(data);
        if(!data) {
            throw 'Db not ready yet';
        }
        this.state.ready = true;
    }

    //Microservice protocol
    @MessagePattern({message: 'bucket'})
    public onMessage(@Payload() data: any) {
        return this.perform(data);
    }

    @EventPattern({event: 'bucket'})
    public onEvent(@Payload() data: any) {
        return this.perform(data);
    }

    private perform(params: payloadInterface): Observable<any> {
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
            return new Observable(subscriber => {
                subscriber.error('Could not find ' + params.api + ':' + params.act);
                subscriber.complete();
            });
        }
    }

}