import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import * as bcrypt from 'bcryptjs';

import { User } from '../model/users.model';

import { CreateUserDto } from '../dto/create-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

import { TokensService } from './tokens.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

    constructor(
      @InjectModel(User) private userRepository: typeof User,
      private userService: UserService,
      private tokenService: TokensService,
    ) {}

    async signIn(dto: CreateUserDto): Promise<AuthResponseDto> {
      const user = await this.validateUser(dto);
      const tokens = await this.tokenService.getTokens(user);

      return {
        id: user.id,
        email: user.email,
        ...tokens,
      }
    }

    async signUp(dto: CreateUserDto): Promise<AuthResponseDto> {
      const candidate = await this.userService.getByEmail(dto.email);

      if (candidate) {
        throw new HttpException('An user with such a mail already exist', HttpStatus.BAD_REQUEST);
      }

      const hashPassword: string = await bcrypt.hash(dto.password, 5);
      const user: User = await this.userService.create({...dto, password: hashPassword});
      const tokens = await this.tokenService.getTokens(user);

      return {
        id: user.id,
        email: user.email,
        ...tokens,
      }
    }

    async verifyPayload(payload: any): Promise<User> {
      const user = await this.userService.getByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    }

    private async validateUser(dto: CreateUserDto): Promise<User> {
      const user = await this.userService.getByEmail(dto.email);
      const passwordEquals: string = await bcrypt.compare(dto.password, user.password);

      if (user && passwordEquals) {
        return user;
      }

      throw new UnauthorizedException({message: 'Incorrect email of password'});
    }
}
