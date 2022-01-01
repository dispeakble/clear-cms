import {Controller, Inject} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {Observable} from "rxjs";

@Controller()
export class AppController {

    private moduleConfig: ModuleInterface = {
        name: 'db',
        version: '20.11.17',
        description: 'db module',
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

    private state: any = {
        ready: false
    };

    constructor(
      @Inject('ProtocolService') private protocolService,
      @Inject('SystemService') private systemService,
      @Inject('DbService') private dbService,
      @Inject('SequelizeService') private sqlService,
    ) {

    }
    async onApplicationBootstrap() {
        await this.protocolService.start();
        await this.dbService.waitForDb();
        if(!this.dbService.getState()) {
            throw 'Db not ready yet';
        }

        const data = await this.systemService.registerModule(this.moduleConfig);
        console.log(data);
        if(!data) {
            throw 'Db not ready yet';
        }
        this.state.ready = true;
    }

    //Microservice protocol
    @MessagePattern({message: 'db'})
    public onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'db'})
    public onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    private perform(data: payloadInterface) {
        try {
            if(!this.state.ready) {
                return new Observable((subscriber) => {
                    subscriber.next({
                        data: 'not ready'
                    });
                });
            }
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload}, this.moduleConfig);
        } catch (ex) {
            console.log(ex);
            return {
                message: 'Db could not find ' + data.api + ':' + data.act
            };
        }
    }

}