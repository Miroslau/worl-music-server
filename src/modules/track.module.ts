import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    Track,
    Comment,
    Author,
    Album,
    TrackSchema,
    CommentSchema,
    AuthorSchema,
    AlbumSchema,
} from '../schemas';

import { TracksController } from '../controllers/tracks.controller';

import { TrackService } from '../services/track.service';
import { FileService } from '../services/file.service';

import { AuthModule } from './auth.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
      MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
      MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
      MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
      forwardRef(() => AuthModule),
    ],
    controllers: [TracksController],
    providers: [TrackService, FileService],
    exports: [TrackService],
})
export class TrackModule {}
