import {Module, DynamicModule} from '@nestjs/common';
import {AppController} from './controllers/app.controller';
import {
    ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {SystemService} from "./services/system.service";
import {Pool as PgPool} from "pg";
import {SequelizeModule} from '@nestjs/sequelize';
import {MainModule} from "./modules/main/main.module";
import {AgencyModule} from "./modules/agency/agency.module";
import {SequelizeModuleOptions} from "@nestjs/sequelize/dist/interfaces/sequelize-options.interface";
import {SequelizeService} from "./services/sequelize.service";
import {TestService} from "./services/test.service";
import {QueryService} from "./services/query.service";

import { ConfigModule } from '@nestjs/config';

export interface AppModuleOptions {
    createdDatabases: string[];
}

@Module({})
export class AppModule {
    static register(options: AppModuleOptions): DynamicModule {
        const sequelize_options: SequelizeModuleOptions = {
            dialect: 'postgres',
            host: process.env.pg_host,
            port: Number(process.env.pg_port),
            username: process.env.pg_user,
            password: process.env.pg_password,
            autoLoadModels: true,
            pool: {
                idle: 5 * 60 * 1000,
                acquire: 5000,
                evict: 5 * 60 * 1000,
            },
            retryAttempts: 10,
            retryDelay: 1000,
        };

        const getConnections = (options: any) => {
            const connectionsArg = process.env.pg_connections || '';
            const prefix = process.env.app || '';
            return connectionsArg
              .trim()
              .split(',')
              .map((dbName) => {
                  const alter =
                    options.createdDatabases.indexOf(dbName) > -1;

                  return SequelizeModule.forRootAsync({
                      name: dbName,
                      useFactory: () => ({
                          ...sequelize_options,
                          alter,
                          database: `${prefix}_${dbName}`,
                      }),
                  });
              });
        };

        const getSqlModules = () => {
            const connectionsArg = process.env.pg_connections || '';
            return connectionsArg
              .trim()
              .split(',')
              .map((c) => {
                  //TODO use lazy loading...very tricky.
                  // https://stackoverflow.com/questions/69626533/nestjs-lazy-loading-a-module-importing-typeorm-doesnt-register-connection-pro
                  switch (c) {
                      case `main`:
                          return MainModule;
                      case `agency`:
                          return AgencyModule;
                  }
              });
        };

        return {
            module: AppModule,
            imports: [
                ConfigModule.forFeature(() => ({
                    createdDatabases: options.createdDatabases
                })),
                ...getConnections(options),
                ...getSqlModules(),
                ClientsModule.register([
                    {
                        name: 'REDIS_SERVICE',
                        transport: Transport.REDIS,
                        options: {
                            url: 'redis://' + process.env.redis_server,
                            port: Number(process.env.redis_port),
                            password: process.env.redis_password,
                            retryAttempts: 10,
                            retryDelay: 5000,
                            disable_resubscribing: false,
                            max_attempts: 30,
                            no_ready_check: true,
                            retry_max_delay: 1000,
                            retry_strategy: 1000,
                        },
                    },
                ]),
            ],
            controllers: [AppController],
            providers: [
                SequelizeService,
                ProtocolService,
                SystemService,
                TestService,
                QueryService,
                { useValue: PgPool, provide: 'PgPool' },
            ],
        };
    }
}
