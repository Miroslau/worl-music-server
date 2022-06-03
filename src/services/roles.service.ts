import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from '../model';

import { CreateRoleDto } from '../dto';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private readonly _roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto): Promise<Role> {
      return this._roleRepository.create(dto);
    }

    async getAllRoles(): Promise<Role[]> {
      return this._roleRepository.findAll();
    }

    async getRoleByValue(value: string): Promise<Role> {
      const role = await this._roleRepository.findOne({ where: { value } });

      if (!role) {
        throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);
      }

      return role;
    }

    async updateRole(dto: CreateRoleDto, id: number) {
      const foundRole = await this._roleRepository.findOne({ where: { id: id } });

      if (!foundRole) {
        throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);
      }

      const updatedRole = await this._roleRepository.update(dto, { where: { id: id } });

      return { updatedRole, created: false };
    }

    async deleteRole(id): Promise<number> {
      return this._roleRepository.destroy({ where: { id: id }, force: true });
    }
}
