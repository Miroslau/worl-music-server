import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document } from 'mongoose';
import * as mongoose from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";
import {Comment} from "./comment.schema";
import {Album} from "./album.schema";
import {Author} from "./author.schema";

export type TrackDocument = Track & Document;

@Schema()
export class Track {
    @ApiProperty({example: 'string', description: `Track's name`})
    @Prop()
    name: string;

    @ApiProperty({example: 'string', description: `Artist's name`})
    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}] })
    artist: Author[];

    @ApiProperty({example: 'string', description: `Description`})
    @Prop()
    text: string;

    @ApiProperty({example: 'number', description: `Count listens`})
    @Prop()
    listens: number;

    @ApiProperty({example: 'string', description: `Url image`})
    @Prop()
    picture: string;

    @ApiProperty({example: 'string', description: `Url audio`})
    @Prop()
    audio: string;

    @ApiProperty({example: 'string', description: `id album`})
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
    album: Album;

    @ApiProperty({example: ['commentId'], description: `id comment`})
    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}] })
    comments: Comment[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
