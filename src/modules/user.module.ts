import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User, Role, UserRoles } from '../model';

import { UsersController } from '../controllers/users.controller';

import { UserService } from '../services/user.service';

import { RolesModule } from './roles.module';
import { AuthModule } from './auth.module';

@Module({
    controllers: [UsersController],
    providers: [UserService],
    imports: [
      SequelizeModule.forFeature([User, Role, UserRoles]),
      RolesModule,
      forwardRef(() => AuthModule),
    ],
    exports: [UserService],
})
export class UserModule {}
