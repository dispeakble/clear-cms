import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    public readonly REDIS_PORT = Number(process.env.redis_port);
    public readonly REDIS_HOST = process.env.redis_server;
    public readonly REDIS_PASSWORD = process.env.redis_password;
    public readonly SESSION_SECRET = process.env.session_secret;
}