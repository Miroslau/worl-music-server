import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'user@gmail.com', description: 'string' })
    @IsString({ message: 'Email must be only string' })
    @IsEmail({},{ message: 'The email is not correct' })
    readonly email: string;

    @ApiProperty({ example: '12345', description: 'User password' })
    @IsString({ message: 'Password must be only string' })
    @Length(4, 16, { message: 'No less than 4 and no more than 16' })
    readonly password: string;
}
