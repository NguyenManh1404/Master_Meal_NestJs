import {BelongsTo, Column, CreatedAt, ForeignKey, Model, Table} from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import UserModel from './user.model';

@Table({
  tableName: 'muc_yeu_thich',
  timestamps: true,
  updatedAt: false,
})
export default class FavoriteModel extends Model {
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
  public id_baidangcongthuc: string;

  @Column({
    type: sequelize.INTEGER,
    allowNull: true,
  })
  public trangthai: number;

  @CreatedAt
  public created_at: Date | null;

  @BelongsTo(() => UserModel, {
    keyType: sequelize.UUID,
    foreignKey: 'user_id',
    constraints: false,
  })
  public user: UserModel;
}
