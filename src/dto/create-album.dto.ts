import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
    @ApiProperty({ example: 'string', description: `Album's name` })
    readonly name: string;

    @ApiProperty({ example: 'string', description: 'Url image' })
    readonly picture: string;

    @ApiProperty({ example: 'string', description: `Artist's name` })
    readonly author: ObjectId;
}
