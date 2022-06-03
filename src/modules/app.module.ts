import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';

import { User, UserRoles, Role } from '../model';

import * as path from 'path';

import { TrackModule } from './track.module';
import { FileModule } from './file.module';
import { AuthorModule } from './author.module';
import { AlbumModule } from './album.module';
import { UserModule } from './user.module';
import { RolesModule } from './roles.module';
import { AuthModule } from './auth.module';
import { TokensModule } from './tokens.module';

@Module({
    imports: [
      ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, '..', 'static')}),
      TrackModule,
      MongooseModule.forRoot('mongodb://mongo/music-platform'),
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'db',
        port: 5432,
        username: 'admin',
        password: 'root',
        database: 'music-platform',
        synchronize: true,
        autoLoadModels: true,
        models: [User, Role, UserRoles],
      }),
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
