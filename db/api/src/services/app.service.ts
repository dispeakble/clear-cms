import {Inject, Injectable} from '@nestjs/common';

@Injectable()
export class AppService {

  private methods = ["register"];

  constructor(

  ) {}

  public perform(data: any) {
    if (this.methods.includes(data.act)) {
      //console.log('appService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
      return this[data.act](data.payload);
    } else {
      console.log("Db.appService." + data.act + " not found");
    }
    return null;
  }

}
