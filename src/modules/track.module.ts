import {Module} from "@nestjs/common";
import {TrackController} from "../controllers/track.controller";
import {TrackService} from "../services/track.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Track, TrackSchema} from "../schemas/track.schema";
import {Comment, CommentSchema} from "../schemas/comment.schema";
import {FileService} from "../services/file.service";
import {Author, AuthorSchema} from "../schemas/author.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    ],
    controllers: [TrackController],
    providers: [TrackService, FileService],
    exports: [
        TrackService
    ]
})
export class TrackModule {

}
