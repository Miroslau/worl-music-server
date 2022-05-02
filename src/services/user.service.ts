import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../model/users.model";
import {CreateUserDto} from "../dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async create (dto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.create(dto);
        return user;
    }

    async getAll () {}

    async getByEmail () {}

    async addRole () {}

    async banUser () {}
}
