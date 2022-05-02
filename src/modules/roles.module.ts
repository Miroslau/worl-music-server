import {Module} from "@nestjs/common";
import {RolesService} from "../services/roles.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../model/roles.model";
import {User} from "../model/users.model";
import {UserRoles} from "../model/user-roles.model";
import {RolesController} from "../controllers/roles.controller";

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles])
    ],
    exports: [
        RolesService
    ]
})
export class RolesModule {}
