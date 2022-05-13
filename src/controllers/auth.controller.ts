import {Body, Controller, Post} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthService} from "../services/auth.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {JwtService} from "@nestjs/jwt";
import {Tokens} from "../types";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Sign in'})
    @ApiResponse({status: 200})
    @Post('/login')
    login (@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: 'Sign up'})
    @ApiResponse({status: 200})
    @Post('/registration')
    registration (@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }
}
