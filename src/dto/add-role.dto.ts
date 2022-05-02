import {ApiProperty} from "@nestjs/swagger";

export class AddRoleDto {
    @ApiProperty({example: 'admin', description: 'string'})
    readonly value: string;
    @ApiProperty({example: 1, description: 'number'})
    readonly userId: number;
}
