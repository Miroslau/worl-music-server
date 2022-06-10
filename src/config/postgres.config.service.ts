import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Role, User, UserRoles } from '../model';

@Injectable()
export class PostgresConfigService implements SequelizeOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const url = this._configService.get<string>('DATABASE_URL');

    if (url) {
      return {
        dialect: 'postgres',
        host: 'ec2-52-214-23-110.eu-west-1.compute.amazonaws.com',
        port: 5432,
        username: 'smpuppjzvjjnxn',
        password:
          '196068573add82f070f8faa8d715428ff330a0d1f87c5e2a65fe1b968db81355',
        database: 'd9vcvevpgrog53',
        synchronize: true,
        autoLoadModels: true,
        models: [User, Role, UserRoles],
      };
    }

    return {
      dialect: 'postgres',
      host: this._configService.get<string>('DATABASE_HOST'),
      port: this._configService.get<number>('POSTGRES_PORT'),
      username: this._configService.get<string>('POSTGRES_USER'),
      password: this._configService.get<string>('POSTGRES_PASSWORD'),
      database: this._configService.get<string>('POSTGRES_DATABASE'),
      synchronize: true,
      autoLoadModels: true,
      models: [User, Role, UserRoles],
    };
  }
}
