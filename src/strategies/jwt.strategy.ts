import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../services/auth.service';

import { User } from '../model/users.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
      private readonly authService: AuthService,
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'test-app-access-token-secret'
      });
    }

    validate(payload: any): Promise<User> {
      return this.authService.verifyPayload(payload);
    }
}
