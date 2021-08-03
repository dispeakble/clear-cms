import * as ConnectRedis from 'connect-redis';
import * as session from 'express-session';
import { RedisService } from 'nestjs-redis';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { ConfigModule } from './config.module';
import { ConfigService } from '../services/config.service';
import { Redis } from './redis.module';

const RedisStore = ConnectRedis.default(session);

export const Session = SessionModule.forRootAsync({
  imports: [Redis, ConfigModule, ConfigService],
  inject: [RedisService, ConfigService],
  useFactory: (
    redisService: RedisService,
    config: ConfigService,
  ): NestSessionOptions => {
    const redisClient = redisService.getClient();
    const store = new RedisStore({ client: redisClient });
    return {
      session: {
        store,
        saveUninitialized: true,
        secret: config.SESSION_SECRET,
        resave: false,
        cookie: {
          signed: true,
          maxAge: 86400000
        }
      },
    };
  },
});