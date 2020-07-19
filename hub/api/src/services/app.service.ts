import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";

interface performInterface {
  act: string;
  payload: any;
}

@Injectable()
export class AppService {
  constructor() { }

}
