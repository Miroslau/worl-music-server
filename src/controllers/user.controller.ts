import {Body, Controller, Get, Post, UseGuards, UsePipes} from "@nestjs/common";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserService} from "../services/user.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {User} from "../model/users.model";
import {AddRoleDto} from "../dto/add-role.dto";
import {BanUserDto} from "../dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Create User'})
    @ApiResponse({status: 200, type: User})
    @UsePipes(ValidationPipe)
    @Post('/createUser')
    create (@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthGuard)
    @Get('/getAllUsers')
    getAll () {
        return this.userService.getAll();
    }

    @ApiOperation({summary: 'Give users role'})
    @ApiResponse({status: 201, type: AddRoleDto})
    @ApiBody({type: AddRoleDto})
    @Post('/addRole')
    addRole (@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto);
    }

    @ApiOperation({summary: 'To ban a user'})
    @ApiResponse({status: 200, type: User})
    @Post('/banUser')
    banUser (@Body() dto: BanUserDto) {
        return this.userService.banUser(dto);
    }
}
