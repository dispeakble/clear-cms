import {Module} from '@nestjs/common';
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

const dev = "true" === process.env.dev || false;

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
        evict: 5 * 60 * 1000
    },
    retryAttempts: 10,
    retryDelay: 1000
};

if (dev) {
    sequelize_options.sync = {
        alter: true,
        /*force: true*//* WARNING: enabling this property will delete all tables and recreate them */
    };
}

const getConnections = () => {
    const connectionsArg = process.env.pg_connections || "";
    return connectionsArg.trim().split(',').map(c => {
        return SequelizeModule.forRootAsync({
            name: c,
            useFactory: () => ({...sequelize_options, database: c})
        });
    });
}

const getModels = () => {
    const connectionsArg = process.env.pg_connections || "";
    return connectionsArg.trim().split(',').map(c => {
        switch(c) {
            case 'main':
                return MainModule;
            case 'agency':
                return AgencyModule;
        }
    });
}

@Module({
    imports: [
        ...getConnections(),
        ...getModels(),
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
                    retry_strategy: 1000
                }
            },
        ]),
        QueryService
    ],
    controllers: [AppController],
    providers: [
        SequelizeService,
        ProtocolService,
        SystemService,
        TestService,
        {useValue: PgPool, provide: 'PgPool'}
    ],
    exports: [QueryService]
})

export class AppModule {
}
