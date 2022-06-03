import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Album, Author, Track, AlbumSchema, AuthorSchema, TrackSchema } from '../schemas';

import { AuthorService } from '../services/author.service';

import { AuthorsController } from '../controllers/authors.controller';

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
  controllers: [AuthorsController],
  exports: [AuthorService],
})
export class AuthorModule {}
