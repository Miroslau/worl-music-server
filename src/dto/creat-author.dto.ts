import {ApiProperty} from "@nestjs/swagger";

export class CreatAuthorDto {
    @ApiProperty({example: 'string'})
    readonly name: string;
}
