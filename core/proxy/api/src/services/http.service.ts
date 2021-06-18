import {Inject, Injectable} from "@nestjs/common";
import FormData from "form-data";


@Injectable()
export class HttpService {
    constructor(@Inject('GotService') private gotService) {

    }

    proxyPostRequest(params) {
        const postObs = this.gotService.post(params.targetUrl, {
            body: params.body
        })

    }
}