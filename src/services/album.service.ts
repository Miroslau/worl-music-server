import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {Model} from "mongoose";
import {Author, AuthorDocument} from "../schemas/author.schema";
import {Track, TrackDocument} from "../schemas/track.schema";
import {CreateAlbumDto} from "../dto/create-album.dto";
import {FileService, FileType} from "./file.service";
import {AddTracksToAlbumDto} from "../dto/create-track.dto";
import {UpdateAlbumDto} from "../dto/update-album.dto";
import * as mongodb from "mongodb";

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

        const author = await this.authorModel.findById(dto.author);
        author.album.push(album._id);
        await author.save();

        return album;

    }

    async addTrackToAlbum (dto: AddTracksToAlbumDto): Promise<Album> {
        const album = await this.albumModel.findById(dto.albumId);

        for (const trackId of dto.tracks) {
            const track = await this.trackModel.findById(trackId);
            track.album = album._id;
            album.tracks.push(track._id);
            await track.save();
        }

        await album.save();

        return album;
    }

    async getAll (count = 4, offset = 0): Promise<Album[]> {
        return this.albumModel.find().skip(Number(offset)).limit(Number(count));
    }

    async getById (id: string): Promise<Album> {
        return this.albumModel.findById(id).populate('tracks');
    }

    async update (id: string, dto: UpdateAlbumDto, picture): Promise<Album> {
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);

        const authorFromDto = await this.authorModel.findById(dto.author);

        const currentAlbum = await this.albumModel.findById(id);

        if (!currentAlbum) {
            throw new HttpException('The album has not found', HttpStatus.NOT_FOUND);
        }

        const authorFromAlbum = await this.authorModel.findById(currentAlbum.author);

        if (authorFromDto._id.toString() !== authorFromAlbum._id.toString()) {
            authorFromAlbum.album = authorFromAlbum.album.filter(item => {
                return item.toString() !== currentAlbum._id.toString();
            })

            authorFromDto.album.push(currentAlbum._id);

            await authorFromDto.save();
            await authorFromAlbum.save();
        }
        if (dto.tracks) {
            for (const item of currentAlbum.tracks) {
                await this.trackModel
                    .findById(item)
                    .updateOne({}, {album: null});
            }

            for (const trackId of dto.tracks) {
                const track = await this.trackModel.findById(trackId);

                const mongoose = require('mongoose');

                track.album = mongoose.Types.ObjectId(id);
                await track.save();
            }
        }

        const album = await this.albumModel.findByIdAndUpdate(id, {
            ...dto,
            picture: picturePath
        })
            .setOptions({overwrite: true, new: true});

        return album;
    }

    async delete () {}

}
