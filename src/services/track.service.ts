import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';

import { FileType } from '../enums/file-type';

import { Track, Comment, Author } from '../schemas';

import { TrackDocument, CommentDocument, AuthorDocument } from '../types';

import { CreateTrackDto, CreateCommentDto } from '../dto';

import { FileService } from './file.service';

import { getAllTracks, getTrackById, searchTrack } from '../aggregations/tracks.aggregation';

@Injectable()
export class TrackService {
    constructor(
      @InjectModel(Track.name) private readonly _trackModel: Model<TrackDocument>,
      @InjectModel(Comment.name) private readonly _commentModel: Model<CommentDocument>,
      @InjectModel(Author.name) private readonly _authorModel: Model<AuthorDocument>,
      private readonly _fileService: FileService,
    ) {}

    async createTrack(dto: CreateTrackDto, files): Promise<Track> {
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
      const audioPath = this._fileService.createFile(FileType.AUDIO, audio[0]);
      const picturePath = this._fileService.createFile(FileType.IMAGE, picture[0]);
      const track = await this._trackModel.create({
        ...dto,
        listens: 0,
        audio: audioPath,
        picture: picturePath
      });

      for (const authorId of dto.artist) {
        const author = await this._authorModel.findById(authorId);

        author.tracks.push(track._id);

        await author.save();
      }

      return track;
    }

    async getAllTracks(count = 10, offset = 0): Promise<Track[]> {
      return this._trackModel
        .aggregate(getAllTracks())
        .skip(Number(offset))
        .limit(Number(count));
    }

    async getTrackById(id: string): Promise<Track> {
      const track: Track[] = await this._trackModel.aggregate(getTrackById(id));

      return track[0];
    }

    async deleteTrack(id: string): Promise<ObjectId> {
      const track = await this._trackModel.findByIdAndDelete(id);

      if (track.album) {
        const album = await this._authorModel.findById(track.album);
        const trackIndex: number = album.tracks.indexOf(track._id);

        if (trackIndex !== -1) {
          album.tracks.splice(trackIndex, 1);
        }

        await album.save();
      }

      for (const authorId of track.artist) {
        const author = await this._authorModel.findById(authorId);
        const trackIndex = author.tracks.indexOf(track._id);

        if (trackIndex !== -1) {
          author.tracks.splice(trackIndex, 1);
        }

        await author.save();
      }

      return track._id;
    }

    async addComment(dto: CreateCommentDto): Promise<Comment> {
      const track = await this._trackModel.findById(dto.trackId);
      const comment = await this._commentModel.create({...dto});

      track.comments.push(comment._id);

      await track.save();

      return comment;
    }

    async listen(id: string): Promise<Track> {
      const track = await this._trackModel.findById(id);

      track.listens +=1;
      track.save();

      return track;
    }

    async search(query: string): Promise<Track[]> {
      return this._trackModel.aggregate(searchTrack(query));
    }
}
