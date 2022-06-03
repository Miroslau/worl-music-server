import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";

import { Model, ObjectId } from 'mongoose';

import { Author, Track, Album } from '../schemas';

import { TrackDocument, AuthorDocument, AlbumDocument } from '../types';

import { CreatAuthorDto, UpdateAuthorDto } from '../dto';

import { getAllAuthors, getAuthorById, searchAuthor } from '../aggregations/author.aggregation';

@Injectable()
export class AuthorService {
    constructor(
      @InjectModel(Author.name) private readonly _authorModel: Model<AuthorDocument>,
      @InjectModel(Track.name) private readonly _trackModel: Model<TrackDocument>,
      @InjectModel(Album.name) private readonly _albumModel: Model<AlbumDocument>,
    ) {}

    async createAuthor(dto: CreatAuthorDto): Promise<Author> {
      return this._authorModel.create({ ...dto });
    }

    async getAllAuthors(): Promise<Author[]> {
      return this._authorModel.aggregate(getAllAuthors());
    }

    async getAuthorById(id: string): Promise<Author> {
      const author: Author[] = await this._authorModel.aggregate(getAuthorById(id));

      return author[0];
    }

    async deleteAuthor(id: string): Promise<ObjectId> {
      const author = await this._authorModel.findByIdAndDelete(id);
      const { album, tracks } = author;

      if (tracks.length) {
        for (const trackId of tracks) {
          const track = await this._trackModel.findById(trackId);
          const { artist, _id } = track;

          if (artist.length > 1 ) {
            const artistIndex = artist.indexOf(_id);

            if (artistIndex !== 1) {
              artist.splice(artistIndex, 1);
            }

            await track.save();

          } else {
              await track.deleteOne();
          }
        }
      }

      if (album.length) {
        for (const albumId of album) {
          const album = await this._albumModel.findById(albumId);
          const { tracks } = album;

          for (const trackId of tracks) {
            await this._trackModel.findById(trackId).updateOne({}, { album: null });
          }

          await album.deleteOne();
        }
      }

      return author._id;
    }

    async updateAuthor(id: string, dto: UpdateAuthorDto): Promise<Author> {
      return this._authorModel
        .findByIdAndUpdate(id, dto)
        .setOptions({ overwrite: true, new: true })
        .populate('album');
    }

    async search(query: string): Promise<Author[]> {
      return this._authorModel.aggregate(searchAuthor(query));
    }
}
