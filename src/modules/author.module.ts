import { Module } from '@nestjs/common';
import { AuthorService } from '../services/author.service';
import { AuthorController } from '../controllers/author.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Album, AlbumSchema } from "../schemas/album.schema";
import {Author, AuthorSchema} from "../schemas/author.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  providers: [AuthorService],
  controllers: [AuthorController],
  exports: [
      AuthorService,
  ]
})
export class AuthorModule {}
