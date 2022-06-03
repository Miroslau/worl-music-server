import {
    Body,
    Controller,
    Get, HttpCode,
    Post,
    UseGuards,
    UsePipes
} from '@nestjs/common';

import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';

import { User } from '../model/users.model';

import { CreateUserDto, AddRoleDto, BanUserDto } from '../dto';

import { UserService } from '../services/user.service';

import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('User')
@Controller('/users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, type: User })
    @UsePipes(ValidationPipe)
    @Post()
    @HttpCode(200)
    async createUser(@Body() dto: CreateUserDto): Promise<User> {
      return this._userService.createUser(dto);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ type: [User] })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers(): Promise<User[]> {
      return this._userService.getAllUsers();
    }

    @ApiOperation({ summary: 'Give users role' })
    @ApiResponse({ status: 200, type: AddRoleDto })
    @ApiBody({ type: AddRoleDto })
    @Post('/addRole')
    @HttpCode(200)
    async addRole(@Body() dto: AddRoleDto): Promise<AddRoleDto> {
      return this._userService.addRole(dto);
    }

    @ApiOperation({ summary: 'To ban a user' })
    @ApiResponse({ status: 200, type: User })
    @Post('/banUser')
    @HttpCode(200)
    async banUser(@Body() dto: BanUserDto): Promise<User> {
      return this._userService.banUser(dto);
    }
}
