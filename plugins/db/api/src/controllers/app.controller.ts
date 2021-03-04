import {Body, Controller, Get, HttpStatus, Inject, Post, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {

    private config: ModuleInterface = {
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

    constructor(
      @Inject('ProtocolService') private protocolService,
      @Inject('SystemService') private systemService,
      @Inject('DbService') private dbService
    ) {
        this.protocolService.start().then(async () => {
            let response = await this.systemService.registerModule(this.config);
            console.log(response);
        })
    }

    //Microservice protocol
    @MessagePattern({message: 'db'})
    public async onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'db'})
    public async onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    private perform(data: payloadInterface) {
        try {
            console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({
                act: data.act,
                payload: data.payload
            }) + ')');
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload}, this.config);
        } catch (ex) {
            console.log(ex);
            return {
                message: 'Db could not find ' + data.api + ':' + data.act
            };
        }
    }

}