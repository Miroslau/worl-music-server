import { Module } from "@nestjs/common";
import {UserController} from "../controllers/user.controller";
import {UserService} from "../services/user.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../model/users.model";
import {Role} from "../model/roles.model";
import {UserRoles} from "../model/user-roles.model";
import {RolesModule} from "./roles.module";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles]),
        RolesModule
    ],
    exports: [
        UserService
    ]
})
export class UserModule {}
