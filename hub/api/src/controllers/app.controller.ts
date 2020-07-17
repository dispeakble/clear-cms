import {Controller, Inject, OnApplicationBootstrap} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {


    constructor(private readonly protocolService: ProtocolService) {

    }


}
