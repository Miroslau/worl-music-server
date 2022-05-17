import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";

import { Model, ObjectId } from 'mongoose';

import { Author } from '../schemas/author.schema';

import { AuthorDocument } from '../types/author-document.type';

import { Track } from '../schemas/track.schema';

import { TrackDocument } from '../types';

import { Album } from '../schemas/album.schema';

import { AlbumDocument } from '../types';

import { CreatAuthorDto } from '../dto/creat-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

import { getAllAuthors, getAuthorById, searchAuthor } from '../aggregations/author.aggregation';

@Injectable()
export class AuthorService {

    constructor(
      @InjectModel(Author.name) private readonly __authorModel__: Model<AuthorDocument>,
      @InjectModel(Track.name) private readonly __trackModel__: Model<TrackDocument>,
      @InjectModel(Album.name) private readonly __albumModel__: Model<AlbumDocument>,
    ) {}

    async createAuthor(dto: CreatAuthorDto): Promise<Author> {
      return this.__authorModel__.create({ ...dto });
    }

    async getAllAuthors(): Promise<Author[]> {
      return this.__authorModel__.aggregate(getAllAuthors());
    }

    async getAuthorById(id: string): Promise<Author> {
      const author: Author[] = await this.__authorModel__.aggregate(getAuthorById(id));

      return author[0];
    }

    async deleteAuthor(id: string): Promise<ObjectId> {
      const author = await this.__authorModel__.findByIdAndDelete(id);
      const { album, tracks } = author;

      if (tracks.length) {
        for (const trackId of tracks) {
          const track = await this.__trackModel__.findById(trackId);
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
          const album = await this.__albumModel__.findById(albumId);
          const { tracks } = album;

          for (const trackId of tracks) {
            await this.__trackModel__.findById(trackId).updateOne({}, { album: null });
          }

          await album.deleteOne();
        }
      }

      return author._id;
    }

    async updateAuthor(id: string, dto: UpdateAuthorDto): Promise<Author> {
      return this.__authorModel__
                 .findByIdAndUpdate(id, dto)
                 .setOptions({ overwrite: true, new: true })
                 .populate('album');
    }

    async search(query: string): Promise<Author[]> {
      return this.__authorModel__.aggregate(searchAuthor(query));
    }
}
