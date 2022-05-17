import { ApiProperty } from '@nestjs/swagger';

export class BanUserDto {
    @ApiProperty({ example: 1, description: 'number' })
    readonly userId: number;

    @ApiProperty({ example: 'text', description: 'string' })
    readonly banReason: string;
}
