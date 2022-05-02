import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "./user.service";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import {User} from "../model/users.model";

@Injectable()
export class AuthService {

    constructor(private userService: UserService,
                private jwtService: JwtService) {}

    async login (dto: CreateUserDto): Promise<{}> {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    async registration (dto: CreateUserDto): Promise<{}> {
        const candidate = await this.userService.getByEmail(dto.email);
        if (candidate) throw new HttpException('An user with such a mail already exist', HttpStatus.BAD_REQUEST);

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.create({...dto, password: hashPassword});
        return this.generateToken(user);
    }

    private async generateToken (user: User): Promise<{}> {
        const payload = {email: user.email, id: user.id, roles: user.roles};
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser (dto: CreateUserDto): Promise<User> {
        const user = await this.userService.getByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Incorrect email of password'});
    }
}
