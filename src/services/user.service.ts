import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { User } from '../model/users.model';

import { CreateUserDto } from '../dto/create-user.dto';
import { AddRoleDto } from '../dto/add-role.dto';
import { BanUserDto } from '../dto/ban-user.dto';

import { RolesService } from './roles.service';

@Injectable()
export class UserService {
    constructor(
      @InjectModel(User) private readonly __userRepository__: typeof User,
      private readonly __roleService__: RolesService,
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
      const role = await this.__roleService__.getRoleByValue('user');

      if (!role) {
        throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);
      }

      const user = await this.__userRepository__.create(dto);

      await user.$set('roles', [role.id]);

      user.roles = [role];

      return user;
    }

    async getAllUsers(): Promise<User[]> {
      return this.__userRepository__.findAll({ include: { all: true } });
    }

    async getById(id: string): Promise<User> {
      return this.__userRepository__.findOne({ where: { id }, include: { all: true } });
    };

    async getByEmail(email: string): Promise<User> {
      return this.__userRepository__.findOne({ where: { email }, include: { all: true } });
    }

    async updateUser(dto: User, id: number) {
      const foundUser = await this.__userRepository__.findOne({ where: { id } });

      if (!foundUser) {
        throw new HttpException('The user has not found', HttpStatus.NOT_FOUND);
      }

      const updateUser = await this.__userRepository__.update(dto, { where: { id } });

      return { updateUser, created: false }
    }

    async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
      const user = await this.__userRepository__.findByPk(dto.userId);
      const role = await this.__roleService__.getRoleByValue(dto.value);

      if (!role && !user) {
        throw new HttpException('The user or the role has not found', HttpStatus.NOT_FOUND);
      }

      await user.$add('role', role.id);

      return dto;
    }

    async banUser(dto: BanUserDto): Promise<User> {
      const user = await this.__userRepository__.findByPk(dto.userId);

      if (!user) {
        throw new HttpException('The user has not found', HttpStatus.NOT_FOUND);
      }

      user.banned = true;
      user.banReason = dto.banReason;

      await user.save();

      return user;
    }
}
