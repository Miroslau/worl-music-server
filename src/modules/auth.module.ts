import { forwardRef, Module } from "@nestjs/common";
import {AuthController} from "../controllers/auth.controller";
import {AuthService} from "../services/auth.service";
import {UserModule} from "./user.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../model/users.model";
import {Role} from "../model/roles.model";
import {UserRoles} from "../model/user-roles.model";
import {JwtStrategy} from "../strategies/jwt.strategy";
import {TokensModule} from "./tokens.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles]),
        forwardRef(() => UserModule),
        TokensModule
    ],
    exports: [
        AuthService,
    ]
})
export class AuthModule {}
