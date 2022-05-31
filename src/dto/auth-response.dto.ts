import { ApiProperty } from '@nestjs/swagger';

import { SWAGGER_SAMPLES_CONSTANTS } from '../constants/swagger.samples.constants';

export class AuthResponseDto {
    @ApiProperty({ example: SWAGGER_SAMPLES_CONSTANTS.USER_ID_SAMPLE })
    readonly id: number;

    @ApiProperty({ example: SWAGGER_SAMPLES_CONSTANTS.EMAIL_SAMPLE })
    readonly email: string;

    @ApiProperty({ example: SWAGGER_SAMPLES_CONSTANTS.TOKEN_SAMPLE })
    readonly accessToken: string;

    @ApiProperty({ example: SWAGGER_SAMPLES_CONSTANTS.TOKEN_SAMPLE })
    refreshToken: string;
}
