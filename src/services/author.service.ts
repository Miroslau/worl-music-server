import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";

import { Model, ObjectId } from 'mongoose';

import { Author, AuthorDocument } from '../schemas/author.schema';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';

import { CreatAuthorDto } from '../dto/creat-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

import { getAllAuthors, getAuthorById, searchAuthor } from '../agregations/author.aggregation';

@Injectable()
export class AuthorService {

    constructor(
      @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
      @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
      @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    ) {}

    async createAuthor(dto: CreatAuthorDto): Promise<Author> {
      return this.authorModel.create({ ...dto });
    }

    async getAllAuthors(): Promise<Author[]> {
      return this.authorModel.aggregate(getAllAuthors());
    }

    async getAuthorById(id: string): Promise<Author> {
      const author: Author[] = await this.authorModel.aggregate(getAuthorById(id));

      return author[0];
    }

    async deleteAuthor(id: string): Promise<ObjectId> {
      const author = await this.authorModel.findByIdAndDelete(id);
      const { album, tracks } = author;

      if (tracks.length) {
        for (const trackId of tracks) {
          const track = await this.trackModel.findById(trackId);
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
          const album = await this.albumModel.findById(albumId);
          const { tracks } = album;

          for (const trackId of tracks) {
            await this.trackModel.findById(trackId).updateOne({}, { album: null });
          }

          await album.deleteOne();
        }
      }

      return author._id;
    }

    async updateAuthor(id: string, dto: UpdateAuthorDto): Promise<Author> {
      return this.authorModel
                 .findByIdAndUpdate(id, dto)
                 .setOptions({ overwrite: true, new: true })
                 .populate('album');
    }

    async search(query: string): Promise<Author[]> {
      return this.authorModel.aggregate(searchAuthor(query));
    }
}
