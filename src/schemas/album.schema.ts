import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as mongoose from 'mongoose';

import { Author } from './author.schema';
import { Track } from './track.schema';

@Schema()
export class Album {
    @ApiProperty({ example: 'string', description: `Album's name` })
    @Prop()
    name: string;

    @ApiProperty({ example: 'string', description: `Artist's name` })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
    author: Author;

    @ApiProperty({ example: 'string', description: `Url image` })
    @Prop()
    picture: string;

    @ApiProperty({ example: ['string'], description: `Id Track` })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
    tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
