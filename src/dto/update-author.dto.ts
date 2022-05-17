import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthorDto {
    @ApiProperty({ example: 'string' })
    readonly name: string;
}
