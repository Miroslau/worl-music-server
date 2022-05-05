import { Role } from '../../model/roles.model';
import {Sequelize} from "sequelize-typescript";
import {UserRoles} from "../../model/user-roles.model";
import {User} from "../../model/users.model";

const sequelize = new Sequelize({ validateOnly: true });
sequelize.addModels([Role, UserRoles, User]);

export const stubRole = (value = 'user'): Role => {
    const role = new Role();
    role.id = 123;
    role.value = 'user';
    role.description = 'It is a user';

    const roles = [role];

    return roles.find((role) => role.value === value);
}

export const stubRoles = (): Role[] => {
    const role = new Role();
    role.id = 123;
    role.value = 'user';
    role.description = 'It is a user';

    const roles = [role];

    return roles;
}
