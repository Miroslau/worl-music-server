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
    return {
      database: this._configService.get<string>('POSTGRES_DATABASE'),
      username: this._configService.get<string>('POSTGRES_USER'),
      password: this._configService.get<string>('POSTGRES_PASSWORD'),
      host: this._configService.get<string>('DATABASE_HOST'),
      port: this._configService.get<number>('POSTGRES_PORT'),
      dialect: 'postgres',
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      models: [User, Role, UserRoles],
    };
  }
}
