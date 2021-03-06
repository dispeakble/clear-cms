import {Controller, Inject, OnApplicationBootstrap} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'hub',
        version: '20.07.19',
        description: 'System hub',
        started: new Date(),
        config: {
            permissions: {
                stop: false,
                restart: true
            }
        },
        dependencies: [],
    };

    constructor(private readonly protocolService: ProtocolService) {

    }


}
