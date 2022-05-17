import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as mongoose from 'mongoose';

import { Album } from './album.schema';
import { Track } from './track.schema';

@Schema()
export class Author {
    @ApiProperty({ example: 'string', description: `Author's name` })
    @Prop()
    name: string;

    @ApiProperty({ example: ['albumId'], description: `Albums` })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }] })
    album: Album[];

    @ApiProperty({ example: ['albumId'], description: `Tracks` })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
    tracks: Track[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
