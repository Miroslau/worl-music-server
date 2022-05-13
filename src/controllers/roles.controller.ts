import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from "@nestjs/common";
import {RolesService} from "../services/roles.service";
import {CreateRoleDto} from "../dto/create-role.dto";
import {Role} from "../model/roles.model";
import {Roles} from "../decorators/roles-auth.decorator";
import {RolesGuard} from "../guards/roles.guard";

@ApiTags('Role')
@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @ApiOperation({summary: 'Create Role'})
    @ApiBody({type: CreateRoleDto})
    @ApiResponse({status: 201, type: Role})
    @Post('/addRole')
    create (@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    @ApiOperation({summary: 'Get All roles'})
    @ApiResponse({status: 200, type: [Role]})
    @Get('/getAllRoles')
    getAll () {
        return this.rolesService.getAll();
    }

    @ApiOperation({summary: 'Get Role by value'})
    @ApiResponse({status: 200, type: Role})
    @Get('/getRole/:value')
    getByValue (@Param('value') value: string) {
        return this.rolesService.getByValue(value);
    }

    @ApiOperation({summary: 'Update role by id'})
    @ApiResponse({status: 200 })
    @Put('/updateRole/:id')
    update (@Param('id') id: number,
            @Body() dto: CreateRoleDto) {
        return this.rolesService.update(dto, id);
    }

    @ApiOperation({summary: 'Delete role by id'})
    @ApiResponse({status: 200 })
    @Delete('/deleteRole/:id')
    delete (@Param('id') id: number) {
        return this.rolesService.delete(id);
    }
}
