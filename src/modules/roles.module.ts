import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Role, User, UserRoles } from '../model';

import { RolesController } from '../controllers/roles.controller';

import { RolesService } from '../services/roles.service';

import { AuthModule } from './auth.module';

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
      RolesModule,
      forwardRef(() => AuthModule),
      SequelizeModule.forFeature([Role, User, UserRoles]),
    ],
    exports: [RolesService],
})
export class RolesModule {}
