import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, AuthResponseDto } from '../dto';

import { AuthService } from '../services/auth.service';

@ApiTags('Authorization')
@Controller('/auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @ApiOperation({ summary: 'Sign in' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post('/login')
    @HttpCode(200)
    async signIn(@Body() userDto: CreateUserDto): Promise<AuthResponseDto> {
      return this._authService.signIn(userDto);
    }

    @ApiOperation({ summary: 'Sign up' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post('/registration')
    @HttpCode(200)
    async signUp(@Body() userDto: CreateUserDto): Promise<AuthResponseDto> {
      return this._authService.signUp(userDto);
    }
}
