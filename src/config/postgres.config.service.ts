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
        host: 'ec2-44-195-169-163.compute-1.amazonaws.com',
        port: 5432,
        username: 'hvvfswbagsoppt',
        password:
          '0d663823c625c1c9df305d658e9e966a8756d5386b8cbd448400dd6a4d38c0b8',
        database: 'derodaitivshkg',
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
