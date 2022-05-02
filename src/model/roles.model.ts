import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {RoleCreationAttrs} from "../interfaces/role-creation-attrs";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "./users.model";
import {UserRoles} from "./user-roles.model";

@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttrs> {
    @ApiProperty({example: 1, description: 'number'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'admin', description: 'string'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;

    @ApiProperty({example: 'Administrator', description: 'string'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[]
}
