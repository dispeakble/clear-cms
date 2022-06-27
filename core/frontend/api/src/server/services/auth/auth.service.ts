import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../../interfaces/module.interface";
import * as md5 from "md5";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

    private methods = ["login", "getProfile", "validateUser", "logout"];

    constructor(
        @Inject('UsersService') private usersService,
        private jwtService: JwtService,
        ) {
    }

    async login(user: any) {
        const {access_token, refresh_token} = await this.getTokens(user.id, user.email)
        const new_refresh_token = await this.hash(refresh_token)
        await this.usersService.updateRtHash(new_refresh_token, user.email).toPromise()
        return {
            access_token,
            refresh_token
        };
    }

    async logout(user: any){
        await this.usersService.deleteRefreshToken(user.userId).toPromise();
    }

    async getProfile(user: any){
        const _user = await this.usersService.getUserById(user.userId).toPromise();
        if (_user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = _user;
            return result;
        }

        return null;
    }

    async refreshTokens(user: any){
        const _user = await this.usersService.getUserById(user.userId).toPromise();
        if(_user){
            const refreshIsValid = await this.compareHash(user.refreshToken, _user.refresh_token)
            if(refreshIsValid) {
                const {access_token, refresh_token} = await this.getTokens(_user.id, _user.email)
                const new_refresh_token = await this.hash(refresh_token)
                await this.usersService.updateRtHash(new_refresh_token, _user.email).toPromise()
                return{
                    access_token,
                    refresh_token
                }
            }
            return null;
        }
        return null;
    }

    async compareHash(data: string, hashed: string){
        return bcrypt.compare(data, hashed)
    }

    async hash(data: string){
        return bcrypt.hash(data, 10)
    }

    async getTokens(userId: number, email:string){
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.JW_ACCESS_SECRET || "at_secret",
                // refresh token expires in 15 minutes
                expiresIn: 60*15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.JW_REFRESH_SECRET || "rt_secret",
                // expires in a week time : 60 * 60 * 24 * 7
                expiresIn: 60 * 60 * 24 * 7,
            }),
        ])

        return{
            access_token,
            refresh_token
        }
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