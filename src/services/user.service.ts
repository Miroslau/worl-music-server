import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../model/users.model";
import {CreateUserDto} from "../dto/create-user.dto";
import {RolesService} from "./roles.service";
import {AddRoleDto} from "../dto/add-role.dto";
import {BanUserDto} from "../dto/ban-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                                   private roleService: RolesService ) {}

    async create (dto: CreateUserDto): Promise<User> {
        const role = await this.roleService.getByValue('user');

        if (!role) throw new HttpException('The role has not found', HttpStatus.NOT_FOUND);

        const user = await this.userRepository.create(dto);
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return user;
    }

    async getAll (): Promise<User[]> {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getById (id: string): Promise<User> {
      const user = await this.userRepository.findOne({where: {id}, include: {all: true}});
      return user;
    };

    async getByEmail (email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    async update (dto, id) {
        const foundUser = await this.userRepository.findOne({where: {id: id} });

        if (!foundUser) throw new HttpException('The user has not found', HttpStatus.NOT_FOUND);

        const updateUser = await this.userRepository.update(dto, {where: {id: id}});

        return {updateUser, created: false}
    }

    async addRole (dto: AddRoleDto): Promise<AddRoleDto> {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getByValue(dto.value);

        if (!role && !user) throw new HttpException('The user or the role has not found', HttpStatus.NOT_FOUND);

        await user.$add('role', role.id);
        return dto;
    }

    async banUser (dto: BanUserDto): Promise<User> {
        const user = await this.userRepository.findByPk(dto.userId);

        if (!user) {
            throw new HttpException('The user has not found', HttpStatus.NOT_FOUND);
        }

        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
