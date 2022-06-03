import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../model';

import { CreateUserDto, AddRoleDto, BanUserDto } from '../dto';

import { RolesService } from './roles.service';

@Injectable()
export class UserService {
    constructor(
      @InjectModel(User) private readonly _userRepository: typeof User,
      private readonly _roleService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
      const role = await this._roleService.getRoleByValue('user');

      if (!role) {
        throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);
      }

      const user = await this._userRepository.create(dto);

      await user.$set('roles', [role.id]);

      user.roles = [role];

      return user;
    }

    async getAllUsers(): Promise<User[]> {
      return this._userRepository.findAll({ include: { all: true } });
    }

    async getById(id: string): Promise<User> {
      return this._userRepository.findOne({ where: { id }, include: { all: true } });
    };

    async getByEmail(email: string): Promise<User> {
      return this._userRepository.findOne({ where: { email }, include: { all: true } });
    }

    async updateUser(dto: User, id: number) {
      const foundUser = await this._userRepository.findOne({ where: { id } });

      if (!foundUser) {
        throw new HttpException('The user has not found', HttpStatus.NOT_FOUND);
      }

      const updateUser = await this._userRepository.update(dto, { where: { id } });

      return { updateUser, created: false }
    }

    async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
      const user = await this._userRepository.findByPk(dto.userId);
      const role = await this._roleService.getRoleByValue(dto.value);

      if (!role && !user) {
        throw new HttpException('The user or the role has not found', HttpStatus.NOT_FOUND);
      }

      await user.$add('role', role.id);

      return dto;
    }

    async banUser(dto: BanUserDto): Promise<User> {
      const user = await this._userRepository.findByPk(dto.userId);

      if (!user) {
        throw new HttpException('The user has not found', HttpStatus.NOT_FOUND);
      }

      user.banned = true;
      user.banReason = dto.banReason;

      await user.save();

      return user;
    }
}
