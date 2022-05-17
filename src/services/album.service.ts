import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';

import { FileType } from '../enums/file-type';

import { Album } from '../schemas/album.schema';

import { AlbumDocument } from '../types';

import { Author } from '../schemas/author.schema';

import { AuthorDocument } from '../types/author-document.type';

import { Track } from '../schemas/track.schema';

import { TrackDocument } from '../types';

import { CreateAlbumDto } from '../dto/create-album.dto';
import { AddTracksToAlbumDto } from '../dto/create-track.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

import { FileService } from './file.service';

import { getAlbumById, getAllAlbums } from '../aggregations/album.aggregation';

@Injectable()
export class AlbumService {

    constructor(
      @InjectModel(Album.name) private readonly __albumModel__: Model<AlbumDocument>,
      @InjectModel(Author.name) private readonly __authorModel__: Model<AuthorDocument>,
      @InjectModel(Track.name) private readonly __trackModel__: Model<TrackDocument>,
      private readonly fileService: FileService,
    ) {}

    async createAlbum(dto: CreateAlbumDto, picture): Promise<Album> {
      const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
      const author = await this.__authorModel__.findById(dto.author);

      const album = await this.__albumModel__.create({
        ...dto,
        picture: picturePath,
      });

      const { _id } = album;

      author.album.push(_id);

      await author.save();

      return album;
    }

    async addTrackToAlbum(dto: AddTracksToAlbumDto): Promise<Album> {
      const { tracks, albumId } = dto;
      const album = await this.__albumModel__.findById(albumId);

      for (const trackId of tracks) {
        const track = await this.__trackModel__.findById(trackId);
        const { _id } = track;
        const includeTrack = album.tracks.includes(_id);

        if (!includeTrack) {
          track.album = album._id;
          album.tracks.push(_id);
        }

        await track.save();
      }

      await album.save();

      return album;
    }

    async getAllAlbums(count = 4, offset = 0): Promise<Album[]> {
      return this.__albumModel__
                 .aggregate(getAllAlbums())
                 .skip(Number(offset))
                 .limit(Number(count));
    }

    async getAlbumById(id: string): Promise<Album> {
      const album: Album[] = await this.__albumModel__.aggregate(getAlbumById(id));
      return album[0];
    }

    async updateAlbum(id: string, dto: UpdateAlbumDto, picture): Promise<Album> {
      const { author, tracks } = dto;
      const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
      const authorFromDto = await this.__authorModel__.findById(author);
      const currentAlbum = await this.__albumModel__.findById(id);

      if (!currentAlbum) {
        throw new HttpException('The album has not found', HttpStatus.NOT_FOUND);
      }

      const authorFromAlbum = await this.__authorModel__.findById(currentAlbum.author);

      if (authorFromDto._id.toString() !== authorFromAlbum._id.toString()) {
        authorFromAlbum.album = authorFromAlbum.album.filter(item => {
          return item.toString() !== currentAlbum._id.toString();
        })

        authorFromDto.album.push(currentAlbum._id);

        await authorFromDto.save();
        await authorFromAlbum.save();
      }

      if (tracks) {
        for (const item of currentAlbum.tracks) {
          await this.__trackModel__
                    .findById(item)
                    .updateOne({}, { album: null });
        }

        for (const trackId of dto.tracks) {
          const track = await this.__trackModel__.findById(trackId);
          const mongoose = require('mongoose');

          track.album = mongoose.Types.ObjectId(id);

          await track.save();
        }
      }

      const album = await this.__albumModel__.findByIdAndUpdate(id, {
        ...dto,
        picture: picturePath,
      }).setOptions({ overwrite: true, new: true });

      return album;
    }

    async deleteAlbum(id: string): Promise<ObjectId> {
      const album = await this.__albumModel__.findByIdAndDelete(id);
      const { _id, author, tracks } = album;
      const authorFromAlbum = await this.__authorModel__.findById(author);
      const authorIndex = authorFromAlbum.album.indexOf(_id);

      if (authorIndex !== -1) {
        authorFromAlbum.album.splice(authorIndex, 1);
      }

      await authorFromAlbum.save();

      for (const trackId of tracks) {
        await this.__trackModel__
                  .findById(trackId)
                  .updateOne({}, { album: null });
      }

      return _id;
    }

}
