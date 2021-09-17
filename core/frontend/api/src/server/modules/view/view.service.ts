import {Injectable, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import createServer from 'next';
import { NextServer } from 'next/dist/server/next';
import { Request, Response } from 'express';


@Injectable()
export class ViewService implements OnModuleInit {
  private server: NextServer;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      const port = Number(process.env.backend_port);
      this.server = createServer({
        dev: true,
        //dev: this.configService.get('NODE_ENV') !== 'production',
        dir: './src/client'
      });
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  handler(req: Request, res: Response) {
    return this.server.getRequestHandler()(req, res);
  }
}