import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';

import { UserCreationAttr } from '../interfaces';

import { Role, UserRoles } from './index';

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
    @ApiProperty({ example: 1, description: 'number' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'user@gmail.com', description: 'string' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: '12345', description: 'User password' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ApiProperty({ example: 'false', description: 'Has User banned' })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;

    @ApiProperty({ example: 'text', description: 'Description of ban' })
    @Column({ type: DataType.STRING, allowNull: true })
    banReason: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @Column({ type: DataType.STRING, allowNull: true })
    tokenId: string;

    @Column({ type: DataType.DATE, allowNull: true })
    tokenExpire: Date;
}
