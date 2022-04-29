import {Module} from "@nestjs/common";
import {TrackModule} from "./track.module";
import { MongooseModule } from '@nestjs/mongoose';
import {FileModule} from "./file.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import { AuthorModule } from './author.module';
import { AlbumModule } from "./album.module";
import * as path from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, '..', 'static')}),
        TrackModule,
        MongooseModule.forRoot('mongodb://mongo/music-platform'),
        FileModule,
        AuthorModule,
        AlbumModule
    ]
})
export class AppModule {}
