import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class AddRoleDto {
    @ApiProperty({example: 'admin', description: 'string'})
    @IsString({message: 'Value must be only string'})
    readonly value: string;

    @ApiProperty({example: 1, description: 'number'})
    @IsNumber({}, {message: 'UserID must be number'})
    readonly userId: number;
}
