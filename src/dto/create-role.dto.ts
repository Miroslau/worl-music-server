import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'Value of Role'})
    readonly root: string;

    @ApiProperty({example: 'Administrator', description: 'Description of role'})
    readonly description: string;
}
