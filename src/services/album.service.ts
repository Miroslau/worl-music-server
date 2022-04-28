import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {Model} from "mongoose";
import {Author, AuthorDocument} from "../schemas/author.schema";
import {Track, TrackDocument} from "../schemas/track.schema";
import {CreateAlbumDto} from "../dto/create-album.dto";
import {FileService, FileType} from "./file.service";

@Injectable()
export class AlbumService {

    constructor(@InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
                @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
                @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                private fileService: FileService) {}


    async create (dto: CreateAlbumDto, picture): Promise<Album> {
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);

        const album = await this.albumModel.create({
            ...dto,
            picture: picturePath,
        });

        for (const authorId of dto.author) {
            const author = await this.authorModel.findById(authorId);
            author.album.push(album._id);
            await author.save();
        }

        for (const trackId of dto.tracks) {
            const track = await this.trackModel.findById(trackId);
            track.album = album._id;
            await track.save();
        }

        return album;

    }

    async getAll (count = 4, offset = 0): Promise<Album[]> {
        return await this.albumModel.find().skip(Number(offset)).limit(Number(count));
    }

    async getById () {}

    async update () {}

    async delete () {}

}
