import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Track} from "./track.schema";
import * as mongoose from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {

    @ApiProperty({example: 'string', description: `username`})
    @Prop()
    username: string;

    @Prop()
    text: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Track' })
    track: Track
}

export const CommentSchema = SchemaFactory.createForClass(Comment);