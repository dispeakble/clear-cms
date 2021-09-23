import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import createServer from 'next';
import { NextServer } from 'next/dist/server/next';
import { Request, Response } from 'express';
import {UrlWithParsedQuery} from "url";


@Injectable()
export class ViewService implements OnModuleInit {
  private server: NextServer;

  constructor(@Inject('AppService') private appService, @Inject('ConfigService') private configService) {

  }

  async onModuleInit(): Promise<void> {
    try {
      this.server = createServer({
        //dev: true,
        dev: this.configService.get('NODE_ENV') !== 'production',
        dir: './src/client'
      });
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  apiHub(params) {
    return this.appService.perform({
      act: 'protocolCall',
      payload: params
    });
  }

  handler(req: any, res: any, url?: UrlWithParsedQuery) {
    req.apiHub = (params) => {
      return this.apiHub(params);
    };

    return this.server.getRequestHandler()(req, res, url);
  }
}