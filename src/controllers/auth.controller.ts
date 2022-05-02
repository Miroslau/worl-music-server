import {Body, Controller, Post} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthService} from "../services/auth.service";
import {User} from "../model/users.model";
import {CreateUserDto} from "../dto/create-user.dto";
import {JwtService} from "@nestjs/jwt";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService,
                private jwtService: JwtService ) {}

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
