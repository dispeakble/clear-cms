import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtUpdateStrategy extends PassportStrategy(Strategy, 'jwt-update') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JW_ACCESS_SECRET || "at_secret",
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email};
    }
}