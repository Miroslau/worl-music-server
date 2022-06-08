import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoDBConfigService implements MongooseOptionsFactory {
    constructor(
      private readonly _configService: ConfigService,
    ) {}

    createMongooseOptions(): MongooseModuleOptions {
      return {
        uri: this._configService.get<string>('MONGODB_URI'),
      };
    }
}
