import {ApiProperty} from "@nestjs/swagger";
import {ObjectId} from "mongoose";

export class CreateTrackDto {
    @ApiProperty({example: 'string'})
    readonly name: string;

    @ApiProperty({example: ['string']})
    readonly artist: [ObjectId];

    @ApiProperty({example: 'string'})
    readonly text: string;

    @ApiProperty({example: 'string'})
    readonly albumId: ObjectId;
}
