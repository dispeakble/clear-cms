import {Controller} from '@nestjs/common';
import { AppService } from './services/app.service';
import {EventPattern} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {

    setTimeout(() => {
      console.log('will send handshake')
      this.appService.sendHandshake();
    }, 2000);

  }

  @EventPattern({ channel: 'system' })
  public handleHandshake(data){
    console.log('got handshake', data);
  }

}
