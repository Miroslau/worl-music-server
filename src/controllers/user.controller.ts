import {Body, Controller, Post} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserService} from "../services/user.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {User} from "../model/users.model";

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Create User'})
    @ApiResponse({status: 200, type: User})
    @Post('/createUser')
    create (@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    getAll () {}

    addRole () {}

    banUser () {}
}
