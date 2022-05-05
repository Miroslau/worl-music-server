import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Track, TrackDocument} from "../schemas/track.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import {Comment, CommentDocument} from "../schemas/comment.schema";
import {CreateTrackDto} from "../dto/create-track.dto";
import {CreateCommentDto} from "../dto/create-comment.dto";
import {FileService, FileType} from "./file.service";
import {Author, AuthorDocument} from "../schemas/author.schema";
import {Album, AlbumDocument} from "../schemas/album.schema";


@Injectable()
export class TrackService {

    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
                @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
                @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
                private fileService: FileService) {}

    async create(dto: CreateTrackDto, files): Promise<Track> {
        if (!files.audio) {
            throw new HttpException('The audio has not found', HttpStatus.NOT_FOUND);
        }

        if (!dto.name) {
            throw new HttpException('The track name has not found', HttpStatus.NOT_FOUND);
        }

        if (!dto.artist) {
            throw new HttpException('The artists have not found', HttpStatus.NOT_FOUND);
        }

        const { picture, audio } = files;
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio[0]);
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture[0]);
        const track = await this.trackModel.create({
            ...dto,
            listens: 0,
            audio: audioPath,
            picture: picturePath
        });

        for (const authorId of dto.artist) {
            const author = await this.authorModel.findById(authorId);
            author.tracks.push(track._id);
            await author.save();
        }

        return track;
    }

    async getAll(count = 10, offset = 0): Promise<Track[]> {
        const tracks = await this.trackModel.find().skip(Number(offset)).limit(Number(count));
        return tracks;
    }

    async getById(id: ObjectId): Promise<Track> {
        const track = await this.trackModel.findById(id).populate('comments');
        return track;
    }

    async delete(id: string): Promise<ObjectId> {
        const track = await this.trackModel.findByIdAndDelete(id);

        if (track.album) {
            const album = await this.albumModel.findById(track.album);
            const trackIndex = album.tracks.indexOf(track._id);
            if (trackIndex !== -1) album.tracks.splice(trackIndex, 1);
            await album.save();
        }

        for (const authorId of track.artist) {
            const author = await this.authorModel.findById(authorId);
            const trackIndex = author.tracks.indexOf(track._id);
            if (trackIndex !== -1) author.tracks.splice(trackIndex, 1);

            await author.save();
        }

        return track._id;
    }

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findById(dto.trackId);
        const comment = await this.commentModel.create({...dto})
        track.comments.push(comment._id);
        await track.save();
        return comment;
    }

    async listen(id: ObjectId) {
        const track = await this.trackModel.findById(id);
        track.listens +=1;
        track.save();
    }

    async search(query: string): Promise<Track[]> {
        const tracks = await this.trackModel.find({
            name: {$regex: new RegExp(query, 'i')}
        })
        return tracks;
    }
}
