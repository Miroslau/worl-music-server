import {Module} from "@nestjs/common";
import {TrackModule} from "./track.module";
import { MongooseModule } from '@nestjs/mongoose';
import {FileModule} from "./file.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthorModule } from './author.module';
import { AlbumModule } from "./album.module";
import * as path from 'path';
import {UserModule} from "./user.module";
import {RolesModule} from "./roles.module";
import {User} from "../model/users.model";
import {UserRoles} from "../model/user-roles.model";
import {Role} from "../model/roles.model";

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
            models: [User, Role, UserRoles]
        }),
        FileModule,
        AuthorModule,
        AlbumModule,
        UserModule,
        RolesModule
    ]
})
export class AppModule {}
