import {Injectable, NotFoundException} from '@nestjs/common';
import {Author, AuthorDocument} from "../schemas/author.schema";
import {Model, ObjectId} from "mongoose";
import {CreatAuthorDto} from "../dto/creat-author.dto";
import {InjectModel} from "@nestjs/mongoose";
import {UpdateAuthorDto} from "../dto/update-author.dto";
import {Track, TrackDocument} from "../schemas/track.schema";
import {Album, AlbumDocument} from "../schemas/album.schema";

@Injectable()
export class AuthorService {

    constructor(@InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
                @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                @InjectModel(Album.name) private albumModel: Model<AlbumDocument>) {}

    async create (dto: CreatAuthorDto): Promise<Author> {
        const author = await this.authorModel.create({...dto});
        return author;
    }

    async getAll (): Promise<Author[]> {
        const author = await this.authorModel.find();
        return author;
    }

    async getBiId (id: string): Promise<Author> {
        const author = await this.authorModel.findById(id).populate('album');
        return author;
    }

    async delete (id: string): Promise<ObjectId> {
        const author = await this.authorModel.findByIdAndDelete(id);
        const { album, tracks } = author;

        if (tracks.length) {
            for (const trackId of tracks) {
                const track = await this.trackModel.findById(trackId);

                const { artist } = track;

                if (artist.length > 1 ) {
                    const artistIndex = artist.indexOf(track._id);
                    if (artistIndex !== 1) artist.splice(artistIndex, 1);
                    await track.save();
                } else {
                    await track.deleteOne();
                }
            }
        }

        if (album.length) {
            for (const albumId of album) {

                const album = await this.albumModel.findById(albumId);

                const { tracks } = album;

                for (const trackId of tracks) {
                    await this.trackModel.findById(trackId).updateOne({}, {album: null});
                }

                await album.deleteOne();
            }
        }

        return author._id;
    }

    async update (id: string, dto: UpdateAuthorDto): Promise<Author> {
        const author = await this.authorModel
            .findByIdAndUpdate(id, dto)
            .setOptions({overwrite: true, new: true})
            .populate('album');
        return author;
    }

    async search (query: string): Promise<Author[]> {
        const authors = await this.authorModel.find({
            name: {$regex: new RegExp(query, 'i')}
        });
        return authors;
    }
}
