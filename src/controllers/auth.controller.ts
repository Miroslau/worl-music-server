import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dto/create-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

import { AuthService } from '../services/auth.service';

@ApiTags('Authorization')
@Controller('/auth')
export class AuthController {

    constructor(private readonly __authService__: AuthService) {}

    @ApiOperation({ summary: 'Sign in' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post('/login')
    @HttpCode(200)
    async signIn(@Body() userDto: CreateUserDto): Promise<AuthResponseDto> {
      return this.__authService__.signIn(userDto);
    }

    @ApiOperation({ summary: 'Sign up' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post('/registration')
    @HttpCode(200)
    async signUp(@Body() userDto: CreateUserDto): Promise<AuthResponseDto> {
      return this.__authService__.signUp(userDto);
    }
}
