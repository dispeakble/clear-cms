import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../../interfaces/module.interface";
import * as md5 from "md5";
import {Observable} from "rxjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private methods = ["login", "validateUser"];

    constructor(
        @Inject('UsersService') private usersService,
        private jwtService: JwtService
        ) {
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.getOne(email).toPromise();
        if (user && user.password === md5.default(pass)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }


    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.authService." + data.act + " not found");
        }
        return null;
    }

}