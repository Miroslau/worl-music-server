import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';

import { RoleCreationAttr } from '../interfaces/role-creation-attr';

import { User } from './users.model';
import { UserRoles } from './user-roles.model';

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttr> {
    @ApiProperty({ example: 1, description: 'number' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'admin', description: 'string' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    value: string;

    @ApiProperty({ example: 'Administrator', description: 'string' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[]
}
