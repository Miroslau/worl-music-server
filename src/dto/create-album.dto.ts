import {ObjectId} from "mongoose";

export class CreateAlbumDto {
    readonly name: string;
    readonly picture: string;
    readonly author: [ObjectId];
    readonly tracks: [ObjectId];
}
