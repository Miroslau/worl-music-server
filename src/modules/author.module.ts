import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";

import { Album, AlbumSchema } from '../schemas/album.schema';
import { Author, AuthorSchema } from '../schemas/author.schema';
import { Track, TrackSchema } from '../schemas/track.schema';

import { AuthorService } from '../services/author.service';

import { AuthorController } from '../controllers/author.controller';

import { AuthModule } from './auth.module';
import { RolesModule } from './roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  providers: [AuthorService],
  controllers: [AuthorController],
  exports: [AuthorService],
})
export class AuthorModule {}
