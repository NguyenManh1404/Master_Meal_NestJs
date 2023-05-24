import {BelongsTo, Column, CreatedAt, ForeignKey, Model, Table} from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import UserModel from './user.model';

@Table({
  tableName: 'follower',
  timestamps: true,
  updatedAt: false,
})
export default class FollowerModel extends Model {
  @Column({
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: sequelize.UUID,
    allowNull: true,
  })
  public user_id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: sequelize.UUID,
    allowNull: true,
  })
  public follower_nguoidung_id: string;

  @CreatedAt
  public created_at: Date | null;

  @BelongsTo(() => UserModel, {
    keyType: sequelize.UUID,
    foreignKey: 'user_id',
    constraints: false,
  })
  public user: UserModel;
}
