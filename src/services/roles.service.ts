import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../model/roles.model';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private readonly __roleRepository__: typeof Role) {}

    async createRole(dto: CreateRoleDto): Promise<Role> {
      return this.__roleRepository__.create(dto);
    }

    async getAllRoles(): Promise<Role[]> {
      return this.__roleRepository__.findAll();
    }

    async getRoleByValue(value: string): Promise<Role> {
      const role = await this.__roleRepository__.findOne({ where: { value } });

      if (!role) {
        throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);
      }

      return role;
    }

    async updateRole(dto: CreateRoleDto, id: number) {
      const foundRole = await this.__roleRepository__.findOne({ where: { id: id } });

      if (!foundRole) {
        throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);
      }

      const updatedRole = await this.__roleRepository__.update(dto, { where: { id: id } });

      return { updatedRole, created: false };
    }

    async deleteRole(id): Promise<number> {
      return this.__roleRepository__.destroy({ where: { id: id }, force: true });
    }
}
