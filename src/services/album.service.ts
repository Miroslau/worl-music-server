import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';

import { FileType } from '../enums/file-type';

import { Album, Track, Author } from '../schemas';

import { AlbumDocument, AuthorDocument, TrackDocument } from '../types';

import { CreateAlbumDto, AddTracksToAlbumDto, UpdateAlbumDto } from '../dto';

import { FileService } from './file.service';

import { getAlbumById, getAllAlbums } from '../aggregations/album.aggregation';

@Injectable()
export class AlbumService {
    constructor(
      @InjectModel(Album.name) private readonly _albumModel: Model<AlbumDocument>,
      @InjectModel(Author.name) private readonly _authorModel: Model<AuthorDocument>,
      @InjectModel(Track.name) private readonly _trackModel: Model<TrackDocument>,
      private readonly _fileService: FileService,
    ) {}

    async createAlbum(dto: CreateAlbumDto, picture, host): Promise<Album> {
      const picturePath = this._fileService.createFile(FileType.IMAGE, picture, host);
      const author = await this._authorModel.findById(dto.author);

      const album = await this._albumModel.create({
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
      const album = await this._albumModel.findById(albumId);

      for (const trackId of tracks) {
        const track = await this._trackModel.findById(trackId);
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
      return this._albumModel
        .aggregate(getAllAlbums())
        .skip(Number(offset))
        .limit(Number(count));
    }

    async getAlbumById(id: string): Promise<Album> {
      const album: Album[] = await this._albumModel.aggregate(getAlbumById(id));

      return album[0];
    }

    async updateAlbum(id: string, dto: UpdateAlbumDto, picture, host): Promise<Album> {
      const { author, tracks } = dto;
      const picturePath = this._fileService.createFile(FileType.IMAGE, picture, host);
      const authorFromDto = await this._authorModel.findById(author);
      const currentAlbum = await this._albumModel.findById(id);

      if (!currentAlbum) {
        throw new HttpException('The album has not found', HttpStatus.NOT_FOUND);
      }

      const authorFromAlbum = await this._authorModel.findById(currentAlbum.author);

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
          await this._trackModel
            .findById(item)
            .updateOne({}, { album: null });
        }

        for (const trackId of dto.tracks) {
          const track = await this._trackModel.findById(trackId);
          const mongoose = require('mongoose');

          track.album = mongoose.Types.ObjectId(id);

          await track.save();
        }
      }

      const album = await this._albumModel.findByIdAndUpdate(id, {
        ...dto,
        picture: picturePath,
      }).setOptions({ overwrite: true, new: true });

      return album;
    }

    async deleteAlbum(id: string): Promise<ObjectId> {
      const album = await this._albumModel.findByIdAndDelete(id);
      const { _id, author, tracks, picture } = album;

      this._fileService.removeFile(picture);

      const authorFromAlbum = await this._authorModel.findById(author);
      const authorIndex = authorFromAlbum.album.indexOf(_id);

      if (authorIndex !== -1) {
        authorFromAlbum.album.splice(authorIndex, 1);
      }

      await authorFromAlbum.save();

      for (const trackId of tracks) {
        await this._trackModel
          .findById(trackId)
          .updateOne({}, { album: null });
      }

      return _id;
    }
}
