import {
    Body,
    Controller,
    Delete,
    Get, HttpCode,
    Param,
    Post,
    Put
} from '@nestjs/common';

import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';

import { Role } from '../model/roles.model';

import { CreateRoleDto } from '../dto';

import { RolesService } from '../services/roles.service';

@ApiTags('Role')
@Controller('/roles')
export class RolesController {
    constructor(private readonly _rolesService: RolesService) {}

    @ApiOperation({ summary: 'Create role' })
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({ status: 200, type: Role })
    @Post()
    @HttpCode(200)
    createRole(@Body() dto: CreateRoleDto) {
      return this._rolesService.createRole(dto);
    }

    @ApiOperation({ summary: 'Get All roles' })
    @ApiResponse({ type: [Role] })
    @Get()
    getAllRoles() {
      return this._rolesService.getAllRoles();
    }

    @ApiOperation({ summary: 'Get role by value' })
    @ApiResponse({ type: Role })
    @Get(':value')
    getRoleByValue(@Param('value') value: string) {
      return this._rolesService.getRoleByValue(value);
    }

    @ApiOperation({ summary: 'Update role by id' })
    @ApiResponse({ status: 200, type: Role })
    @Put(':id')
    @HttpCode(200)
    updateRole(
      @Param('id') id: number,
      @Body() dto: CreateRoleDto,
    ) {
      return this._rolesService.updateRole(dto, id);
    }

    @ApiOperation({ summary: 'Delete role by id' })
    @ApiResponse({ status: 200 })
    @Delete(':id')
    deleteRole(@Param('id') id: number) {
      return this._rolesService.deleteRole(id);
    }
}
