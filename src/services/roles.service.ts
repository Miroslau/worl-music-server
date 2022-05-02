import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "../model/roles.model";
import {CreateRoleDto} from "../dto/create-role.dto";

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async create (dto: CreateRoleDto): Promise<Role> {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getAll (): Promise<Role[]> {
        const roles = await this.roleRepository.findAll();
        return roles;
    }

    async getByValue (value: string): Promise<Role> {
        const role = await this.roleRepository.findOne({where: {value}});

        if (!role) throw new HttpException('The role has not found', HttpStatus.NOT_FOUND)

        return role;
    }

    async update (dto, id): Promise<{}> {
        const foundRole = await this.roleRepository.findOne({where: {id: id}})

        if (!foundRole) throw new HttpException('The role has not found', HttpStatus.NOT_FOUND)

        const updatedRole = await this.roleRepository.update(dto, {where: {id: id}});
        return {updatedRole, created: false};
    }

    async delete (id): Promise<number> {
        const role = await this.roleRepository.destroy({where: {id: id}, force: true})
        return role;
    }
}
