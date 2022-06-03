import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { nanoid } from 'nanoid';

import { User } from '../model';

import { AuthResponseDto } from '../dto';

import { UserService } from './user.service';


@Injectable()
export class TokensService {
    constructor(
      private readonly _userService: UserService,
      private readonly _jwtService: JwtService,
    ) {}

    async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
      try {
        const verifiedToken = this._jwtService.verify(refreshToken, {
          secret: 'test-app-refResh-token-secret',
        });

        const { userId } = verifiedToken;
        const user = await this._userService.getById(userId);
        const now = new Date();

        if (!user || user.tokenId !== refreshToken || now > user.tokenExpire) {
          throw new ForbiddenException('Token is expired');
        }

        const tokens = await this.getTokens(user)

        return {
          id: user.id,
          email: user.email,
          ...tokens,
        }

      } catch (error) {
          throw new ForbiddenException();
      }
    }

    async getTokens(user: User) {
      const accessToken = this._jwtService.sign(
        { email: user.email, id: user.id, roles: user.roles },
        { secret: 'test-app-access-token-secret', expiresIn: 1000 * 60 * 15 },
      );

      const refreshTokenId = nanoid();

      const expire = 1000 * 60 * 24 * 15;

      const refreshToken = this._jwtService.sign(
        { email: user.email, id: user.id, roles: user.roles, refreshTokenId },
        {
          secret: 'test-app-refResh-token-secret',
          expiresIn: expire,
        },
      );

      user.tokenId = refreshTokenId;

      const expiration = new Date();

      expiration.setTime(expiration.getTime() + expire);

      user.tokenExpire = expiration;

      await this._userService.updateUser(user, user.id);

      return { accessToken, refreshToken };
    }
}
