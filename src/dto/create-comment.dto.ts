import {ObjectId} from "mongoose";
import {ApiProperty, ApiResponse} from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({example: 'string', description: `username`})
    readonly username: string;

    @ApiProperty({example: 'string', description: 'text'})
    readonly text: string;

    @ApiProperty({example: 'string', description: 'track'})
    readonly trackId: ObjectId;
}
