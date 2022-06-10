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
