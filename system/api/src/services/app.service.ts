import {Inject, Injectable, OnApplicationBootstrap} from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AppService {

  constructor(
      @Inject('APP_SERVICE') private client: ClientProxy,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.client.connect();
    console.log('system connected to redis')
  }

  public sendHandshake() {
    const pattern = {
      channel: 'hub'
    };
    const data = {
      id: 'system',
      channel:'system'
    };
    return this.client.emit<string>(pattern, data);
  }

}
