import { ObjectId } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
    @ApiProperty({ example: 'string', description: `Album's name` })
    readonly name: string;

    @ApiProperty({ example: 'string', description: `Url image` })
    readonly picture: string;

    @ApiProperty({ example: 'string', description: `Artist's name` })
    readonly author: ObjectId;

    @ApiProperty({ example: ['string'], description: `Track's id` })
    readonly tracks: [ObjectId];
}
