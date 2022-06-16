import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import * as path from 'path';

import { TrackModule } from './track.module';
import { FileModule } from './file.module';
import { AuthorModule } from './author.module';
import { AlbumModule } from './album.module';
import { UserModule } from './user.module';
import { RolesModule } from './roles.module';
import { AuthModule } from './auth.module';
import { TokensModule } from './tokens.module';

import { MongoDBConfigService } from '../config/mongoDB.config.service';
import { PostgresConfigService } from '../config/postgres.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoDBConfigService,
      inject: [MongoDBConfigService],
    }),
    SequelizeModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    TrackModule,
    FileModule,
    AuthorModule,
    AlbumModule,
    UserModule,
    RolesModule,
    AuthModule,
    TokensModule,
  ],
})
export class AppModule {}
