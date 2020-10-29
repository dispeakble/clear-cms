import {Body, Controller, Get, HttpStatus, Inject, Post, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";
import {WebsocketGatewayService} from "../services/websocket.gateway.service";

@Controller()
export class SystemController {

    constructor(
        @Inject('SystemService') private systemService,
        private wsService: WebsocketGatewayService,
    ) {

    }


}