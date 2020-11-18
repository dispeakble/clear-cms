import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";

@Injectable()
export class AuthService {

  private methods = ["doLogin", "loadConfig"];
  private config = {
    admin_table:"",
    admin_fields: []
  };

  constructor(@Inject('ProtocolService') private protocolService) {


  }

  public loadConfig(){
    const config_string = fs.readFileSync(__dirname + '/../../config/auth.json').toString('utf-8');
    this.config = JSON.parse(config_string);
  }

  onApplicationBootstrap(){
    try {
      this.loadConfig();
    } catch (err){
      console.log(err);
    }
  }

  public async doLogin(params){
    const payload: payloadInterface = {
      channel:'db',
      api:'db',
      act:'get',
      payload:{
        channel:'system',
        data:{
          what:this.config.admin_table,
          fields:this.config.admin_fields,
          where:{
            email:params.email,
            password:params.password,
            active:1
          },
          limit:[0,1]
        }
      }
    }
    const auth_response = await this.protocolService.sendMessage(payload);
    return auth_response.data;
  }

  public perform(data: any, config?: ModuleInterface) {
    if (this.methods.includes(data.act)) {
      return this[data.act](data.payload, config);
    } else {
      console.log("System.httpService." + data.act + " not found");
    }
    return null;
  }

}