import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Album, AlbumSchema} from "../schemas/album.schema";
import {AlbumController} from "../controllers/album.controller";
import {AlbumService} from "../services/album.service";
import {Author, AuthorSchema} from "../schemas/author.schema";
import {Track, TrackSchema} from "../schemas/track.schema";
import {FileService} from "../services/file.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
        MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
        MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    ],
    providers: [AlbumService, FileService],
    controllers: [AlbumController]
})
export class AlbumModule {}