import {Inject, Injectable} from "@nestjs/common";
import {GotService} from "@t00nday/nestjs-got";

@Injectable()
export class BucketService {

    constructor(private readonly gotService: GotService, @Inject('REDIS_SERVICE') private readonly protocolService) {

    }

}