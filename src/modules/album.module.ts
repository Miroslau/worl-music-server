import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Album, Author, Track, AlbumSchema, AuthorSchema, TrackSchema } from '../schemas';

import { AlbumsController } from '../controllers/albums.controller';

import { AlbumService } from '../services/album.service';
import { FileService } from '../services/file.service';

import { AuthModule } from './auth.module';

@Module({
    imports: [
      MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
      MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
      MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
      AuthModule,
    ],
    providers: [AlbumService, FileService],
    controllers: [AlbumsController],
})
export class AlbumModule {}
