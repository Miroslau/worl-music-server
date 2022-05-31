import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
      private readonly __jwtService__: JwtService,
      private readonly __reflector__: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      try {
        const requiredRoles = this.__reflector__.getAllAndOverride(
          ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException({ message: 'The user is not logged in'})
        }

        const user = this.__jwtService__.verify(token);

        request.user = user;

        return user.roles.some(role => requiredRoles.includes(role.value));

        } catch (e) {
            throw new HttpException('Not access', HttpStatus.FORBIDDEN);
      }
    }

}
