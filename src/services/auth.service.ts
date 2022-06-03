import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { User } from '../model';

import { CreateUserDto, AuthResponseDto } from '../dto';

import { TokensService } from './tokens.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
      private readonly _userService: UserService,
      private readonly _tokenService: TokensService,
    ) {}

    async signIn(dto: CreateUserDto): Promise<AuthResponseDto> {
      const user = await this.validateUser(dto);
      const tokens = await this._tokenService.getTokens(user);

      return {
        id: user.id,
        email: user.email,
        ...tokens,
      }
    }

    async signUp(dto: CreateUserDto): Promise<AuthResponseDto> {
      const candidate = await this._userService.getByEmail(dto.email);

      if (candidate) {
        throw new HttpException('An user with such a mail already exist', HttpStatus.BAD_REQUEST);
      }

      const hashPassword: string = await bcrypt.hash(dto.password, 5);
      const user = await this._userService.createUser({ ...dto, password: hashPassword });
      const tokens = await this._tokenService.getTokens(user);

      return {
        id: user.id,
        email: user.email,
        ...tokens,
      }
    }

    async verifyPayload(payload: any): Promise<User> {
      const user = await this._userService.getByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    }

    private async validateUser(dto: CreateUserDto): Promise<User> {
      const user = await this._userService.getByEmail(dto.email);
      const passwordEquals: string = await bcrypt.compare(dto.password, user.password);

      if (user && passwordEquals) {
        return user;
      }

      throw new UnauthorizedException({ message: 'Incorrect email of password' });
    }
}
