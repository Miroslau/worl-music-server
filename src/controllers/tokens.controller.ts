import {Controller, HttpCode, HttpStatus, Post, Req, Res} from "@nestjs/common";
import {TokensService} from "../services/tokens.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {SWAGGER_ENDPOINT_DESCRIPTION} from "../constants/swagger.samples.constants";
import {AuthResponseDto} from "../dto/auth-response.dto";

@ApiTags('Tokens')
@Controller('/tokens')
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @ApiOperation({summary: SWAGGER_ENDPOINT_DESCRIPTION.TOKENS_REFRESH})
    @ApiResponse({ status: HttpStatus.OK, type: AuthResponseDto })
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    public async refreshTokens(@Req() req, @Res() res) {
        const { refreshToken } = req.cookies;
        const userData = await this.tokensService.refreshTokens(refreshToken);
        const refreshedToken = userData.refreshToken;
        delete userData.refreshToken;
        res.cookie('refreshToken', refreshedToken, { httpOnly: true });
        return userData;
    }
}