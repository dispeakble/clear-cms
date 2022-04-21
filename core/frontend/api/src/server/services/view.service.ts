import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import createServer from 'next';
import { NextServer } from 'next/dist/server/next';
import {UrlWithParsedQuery} from "url";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class ViewService implements OnModuleInit {
  private server!: NextServer;

  constructor(@Inject('AppService') private appService: AppService, @Inject('ConfigService') private configService: ConfigService) {

  }

  async onModuleInit(): Promise<void> {
    try {
      this.server = createServer({
        dev: this.configService.get('NODE_ENV') !== 'production',
        dir: './src/client'
      });
      await this.server.prepare();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async apiHub(params) {
    return (await this.appService.perform({
      act: 'protocolCall',
      payload: params
    })).toPromise();
  }

  handler(req: any, res: any, url?: UrlWithParsedQuery) {
    req.apiHub = (params: any) => {
      return this.apiHub(params);
    };

    return this.server.getRequestHandler()(req, res, url);
  }
}