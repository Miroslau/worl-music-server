import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Track, TrackSchema } from '../schemas/track.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Author, AuthorSchema } from '../schemas/author.schema';
import { Album, AlbumSchema } from '../schemas/album.schema';

import { TrackController } from '../controllers/track.controller';

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
    controllers: [TrackController],
    providers: [TrackService, FileService],
    exports: [TrackService],
})
export class TrackModule {}
